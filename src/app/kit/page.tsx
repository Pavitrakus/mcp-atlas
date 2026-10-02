"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { servers } from "@/data/servers";
import { installSnippet } from "@/lib/install";
import { readKit, writeKit } from "@/components/kit-button";
import type { ClientId } from "@/lib/types";

const clients: { id: ClientId; label: string }[] = [
  { id: "cursor", label: "Cursor" },
  { id: "claude", label: "Claude" },
  { id: "vscode", label: "VS Code" },
  { id: "claude-code", label: "Claude Code" },
  { id: "generic", label: "Generic" },
];

export default function KitPage() {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [client, setClient] = useState<ClientId>("cursor");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const sync = () => setSlugs(readKit());
    sync();
    window.addEventListener("atlas-kit", sync);
    return () => window.removeEventListener("atlas-kit", sync);
  }, []);

  const chosen = slugs.map((slug) => servers.find((server) => server.slug === slug)).filter((server) => server != null);
  const bundle = chosen.map((server) => `# ${server.name}\n${installSnippet(server, client).body}`).join("\n\n");

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 md:px-8">
      <p className="kicker">Saved servers</p>
      <h1 className="display mt-3 text-6xl">Your shortlist.</h1>
      <p className="mt-4 text-ink-soft">
        Servers you saved in this browser. Choose a client to copy their installation instructions together.
      </p>
      {chosen.length === 0 ? (
        <p className="mt-8 border-t border-ink py-6">
          Nothing saved yet. <Link href="/servers">Browse servers</Link> and choose “Save server” on any listing.
        </p>
      ) : (
        <ul className="mt-8 border-t border-ink">
          {chosen.map((server) => (
            <li key={server.slug} className="flex items-baseline justify-between gap-4 border-b border-rule py-3">
              <Link href={`/servers/${server.slug}`} className="font-display text-3xl no-underline">
                {server.name}
              </Link>
              <button type="button" className="kicker" onClick={() => writeKit(slugs.filter((slug) => slug !== server.slug))}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-6 flex flex-wrap gap-2">
        {clients.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`install-panel__tab border px-3 py-2 text-sm font-medium ${client === item.id ? "border-ink bg-ink text-paper" : "border-rule"}`}
            onClick={() => setClient(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      {chosen.length > 0 ? (
        <>
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              className="text-sm font-semibold text-oxblood"
              onClick={async () => {
                await navigator.clipboard.writeText(bundle);
                setCopied(true);
              }}
            >
              {copied ? "Copied" : "Copy instructions"}
            </button>
          </div>
          <pre className="mt-2 overflow-x-auto border border-rule bg-verso p-4 font-mono text-xs">{bundle}</pre>
        </>
      ) : null}
    </div>
  );
}
