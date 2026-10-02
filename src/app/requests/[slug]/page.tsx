import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CommentForm } from "@/components/comment-form";
import { ServerSlip } from "@/components/server-slip";
import { VoteButton } from "@/components/vote-button";
import { closeMatches, getRequest, listComments } from "@/lib/ledger";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const request = getRequest(slug);
  if (!request) return { title: "Missing request" };
  return { title: request.title, description: request.wish };
}

export default async function RequestPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const request = getRequest(slug);
  if (!request) notFound();
  const matches = closeMatches(`${request.title} ${request.wish}`);
  const notes = listComments(slug);
  return (
    <article className="mx-auto max-w-[1180px] px-5 py-10 md:px-8">
      <p className="kicker">Wanted {String(request.number).padStart(5, "0")}</p>
      <h1 className="display mt-3 max-w-4xl text-6xl md:text-7xl">{request.title}</h1>
      <p className="mt-6 max-w-2xl font-display text-3xl leading-snug">{request.wish}</p>
      <dl className="mt-8 grid max-w-2xl grid-cols-2 gap-4 border-t border-ink pt-4 text-sm">
        <Fact label="Service" value={request.service} />
        <Fact label="Platform" value={request.platform} />
        <Fact label="Client" value={request.client} />
        <Fact label="Hosting" value={request.hosting} />
        <Fact label="Asked by" value={request.author} />
        <Fact label="Origin" value={request.origin === "edition" ? "Opened with this edition" : "A reader of this copy"} />
      </dl>
      {request.workflow ? <p className="mt-6 max-w-2xl text-ink-soft">{request.workflow}</p> : null}
      {request.reference ? (
        <p className="mt-4">
          <a href={request.reference}>{request.reference}</a>
        </p>
      ) : null}
      <div className="mt-8 flex flex-wrap items-center gap-4">
        <VoteButton slug={request.slug} votes={request.votes} />
        <Link href={`/requests/new?wish=${encodeURIComponent(request.wish)}`} className="kicker">
          File a related wish
        </Link>
      </div>

      <section className="mt-14">
        <h2 className="font-display text-4xl">Close matches</h2>
        {matches.length === 0 ? (
          <p className="mt-3 max-w-xl text-ink-soft">No plate in this edition comes close. That is the point of the entry.</p>
        ) : (
          <div className="mt-2">
            {matches.map((server) => (
              <ServerSlip key={server.slug} server={server} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-14 max-w-2xl">
        <h2 className="font-display text-4xl">Build this</h2>
        <p className="mt-3 text-ink-soft">
          The wish, the constraints above, and the close matches are the brief. If you ship a legitimate server, submit the repository. This page does not assign the work or collect payment.
        </p>
        <Link href="/submit" className="mt-4 inline-block kicker text-oxblood">
          Submit a repository
        </Link>
        <h3 className="kicker mt-10">Notes</h3>
        <ul className="mt-3">
          {notes.length === 0 ? <li className="text-dust">No notes yet.</li> : null}
          {notes.map((note) => (
            <li key={note.id} className="border-t border-rule py-3">
              <p>{note.body}</p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-dust">
                {note.author} · {note.createdAt.slice(0, 10)}
              </p>
            </li>
          ))}
        </ul>
        <CommentForm slug={request.slug} />
      </section>
    </article>
  );
}

function Fact({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <dt className="kicker">{label}</dt>
      <dd className="mt-1">{value || "Unspecified"}</dd>
    </div>
  );
}
