import type { Metadata } from "next";
import { RequestForm } from "@/components/request-form";

export const metadata: Metadata = {
  title: "Request a capability",
  description: "Describe an ability you wish an assistant had.",
};

export default async function NewRequestPage({ searchParams }: { searchParams: Promise<{ wish?: string; title?: string }> }) {
  const params = await searchParams;
  return (
    <div className="mx-auto max-w-3xl px-5 py-10 md:px-8">
      <p className="kicker">New entry</p>
      <h1 className="display mt-3 text-6xl">What do you wish your AI could do?</h1>
      <p className="mt-4 text-ink-soft">
        If a plate already covers it, say so in the reference. Unofficial workarounds that steal accounts, bypass logins, or ignore a service&apos;s access rules will not be printed.
      </p>
      <div className="mt-8">
        <RequestForm initialWish={params.wish ?? ""} initialTitle={params.title ?? ""} />
      </div>
    </div>
  );
}
