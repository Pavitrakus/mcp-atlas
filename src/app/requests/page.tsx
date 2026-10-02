import type { Metadata } from "next";
import Link from "next/link";
import { listRequests } from "@/lib/ledger";

export const metadata: Metadata = {
  title: "Wanted",
  description: "Capabilities people wish existed. Votes belong to this copy of the Atlas.",
};

export const dynamic = "force-dynamic";

export default function RequestsPage() {
  const requests = listRequests();
  return (
    <div className="mx-auto max-w-[1180px] px-5 py-10 md:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="kicker">Ledger</p>
          <h1 className="display mt-3 text-6xl md:text-8xl">Wanted</h1>
        </div>
        <Link href="/requests/new" className="border border-ink px-4 py-3 kicker no-underline">
          Request a capability
        </Link>
      </div>
      <p className="mt-4 max-w-xl text-ink-soft">
        Opened with this edition, then added to by whoever uses this copy. A vote is stored here. It is not a global count from the internet.
      </p>
      <ol className="mt-10">
        {requests.map((request) => (
          <li key={request.slug} className="grid gap-3 border-t border-rule py-5 md:grid-cols-12">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-dust md:col-span-2">
              {String(request.number).padStart(5, "0")}
            </p>
            <div className="md:col-span-8">
              <Link href={`/requests/${request.slug}`} className="font-display text-4xl no-underline">
                {request.title}
              </Link>
              <p className="mt-2 max-w-2xl text-ink-soft">{request.wish}</p>
              <p className="mt-2 kicker">{request.origin === "edition" ? "Opened with this edition" : "Reader"}</p>
            </div>
            <p className="font-mono text-sm text-dust md:col-span-2 md:text-right">
              {request.votes} {request.votes === 1 ? "vote" : "votes"}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
