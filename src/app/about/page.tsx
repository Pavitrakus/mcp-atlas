import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "How the Atlas works and what to check before connecting a server.",
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-10 md:px-8">
      <p className="kicker">About Atlas</p>
      <h1 className="display mt-3 text-6xl">A useful directory, with the details that matter.</h1>
      <div className="mt-8 space-y-6 text-lg text-ink-soft">
        <p>
          MCP lets an AI assistant use tools supplied by a server. Atlas helps you find those servers by task, then shows what each one does and where its code lives. <Link href="/journal/what-is-an-mcp-server">Learn how MCP works</Link>.
        </p>
        <p>
          Listings are based on public projects. Some details come from their repositories and package records. Follow the source links on a server page to check its current documentation before installing.
        </p>
        <p>
          A listing is not a safety guarantee. Check the tools a server exposes, the access it asks for, and its source code. Atlas does not install packages, execute submitted code, or store your API keys.
        </p>
        <p>
          Can&apos;t find a capability? <Link href="/requests/new">Request it</Link>. Builders can <Link href="/submit">submit a public GitHub repository</Link> for review.
        </p>
        <p>
          Atlas also offers its directory through MCP. Connect to <Link href="/api/mcp">/api/mcp</Link> over streamable HTTP, or run <span className="font-mono text-base">npm run mcp</span> for stdio. These tools search Atlas listings.
        </p>
        <p>
          Submissions that bypass logins or a service&apos;s access rules are out of scope. If an integration needs a permitted API, the request should say so.
        </p>
      </div>
    </article>
  );
}
