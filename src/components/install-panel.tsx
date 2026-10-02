"use client";

import { useMemo, useState } from "react";
import { CLIENTS, installSnippet, type InstallSnippet } from "@/lib/install";
import type { ClientId, ServerRecord } from "@/lib/types";
import { KitButton } from "@/components/kit-button";

export function InstallPanel({ server }: { server: ServerRecord }) {
  const [client, setClient] = useState<ClientId>("cursor");
  const snippet = useMemo(() => installSnippet(server, client), [server, client]);
  return (
    <section aria-labelledby="install-heading" className="install-panel min-w-0 overflow-hidden border border-rule bg-verso">
      <div className="flex items-center justify-between gap-3 border-b border-rule px-5 py-4">
        <h2 id="install-heading" className="text-xl font-semibold text-ink">
          Install
        </h2>
        <KitButton slug={server.slug} />
      </div>
      <div className="flex flex-wrap gap-2 px-5 py-4" role="tablist" aria-label="Client">
        {CLIENTS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={client === item.id}
            className={`install-panel__tab border px-3 py-2 text-sm font-medium ${client === item.id ? "border-ink bg-ink text-paper" : "border-rule text-ink-soft"}`}
            onClick={() => setClient(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <Snippet snippet={snippet} />
      {snippet.cursorLink ? (
        <p className="border-t border-rule px-5 py-4 text-sm">
          <a href={snippet.cursorLink}>Open in Cursor</a>
          <span className="mt-1 block text-dust">Works on a machine where Cursor is installed. Otherwise copy the block.</span>
        </p>
      ) : null}
    </section>
  );
}

function Snippet({ snippet }: { snippet: InstallSnippet }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="border-t border-rule">
      <div className="flex items-center justify-between px-5 py-3">
        <p className="text-sm font-medium">{snippet.title}</p>
        <button
          type="button"
          className="install-panel__copy text-sm font-semibold text-oxblood"
          onClick={async () => {
            await navigator.clipboard.writeText(snippet.body);
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
          }}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="install-panel__code mx-4 overflow-x-auto rounded-lg p-4 font-mono text-xs leading-relaxed text-ink-soft">
        <code>{snippet.body}</code>
      </pre>
      <p className="mt-4 border-t border-rule px-5 py-4 text-sm text-dust">{snippet.note}</p>
    </div>
  );
}
