import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy", description: "What this edition stores, and what it refuses to store." };

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-10 md:px-8">
      <p className="kicker">House rules</p>
      <h1 className="display mt-3 text-6xl">Privacy</h1>
      <div className="mt-8 space-y-4 text-ink-soft">
        <p>Browsing, searching, and reading install instructions require no account.</p>
        <p>A vote sets an HTTP-only cookie, <span className="font-mono text-sm">atlas_voter</span>, a random id used only to stop the same browser voting twice on one request. The field kit is stored in your browser&apos;s local storage and is not sent to the server.</p>
        <p>A request or a comment stores the text you typed, an optional name, and the time. Do not put secrets, access tokens, or other people&apos;s private data in those fields.</p>
        <p>Submitting a repository sends that URL to GitHub&apos;s public API from this server and stores the metadata GitHub returns, plus your optional note. We do not ask for your GitHub password.</p>
        <p>The admin desk, if enabled, stores a hashed session cookie after you enter the token. The token itself is an environment variable, not a row in the database.</p>
        <p>This edition does not run third-party analytics. Server logs may still exist wherever you host it.</p>
      </div>
    </article>
  );
}
