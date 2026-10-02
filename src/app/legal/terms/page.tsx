import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms", description: "Terms for using this edition of the Atlas." };

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-10 md:px-8">
      <p className="kicker">House rules</p>
      <h1 className="display mt-3 text-6xl">Terms</h1>
      <div className="mt-8 space-y-4 text-ink-soft">
        <p>The Atlas is a directory. It points at other people&apos;s software. Installing a server is your decision, on your machine, under that software&apos;s license.</p>
        <p>Descriptions are summaries of public material observed on the dates printed on each plate. They go stale. The repository is the authority, not this page.</p>
        <p>Do not submit projects whose purpose is credential theft, account resale, paywall bypass, captcha evasion, or any other break-in. Submissions that ask for that will be rejected.</p>
        <p>Votes, notes, and submissions on a given copy of the Atlas belong to that copy. They are not a promise of uptime, moderation speed, or a global community count.</p>
        <p>The software in this repository is offered as open source under its license file. Third-party servers keep their own licenses. A missing SPDX id means we did not see one, not that the work is free to reuse.</p>
      </div>
    </article>
  );
}
