"use client";

import Link from "next/link";
import { useState } from "react";

type Preview = {
  repoUrl: string;
  owner: string;
  repo: string;
  name: string;
  description: string;
  language: string | null;
  license: string | null;
  stars: number | null;
  archived: boolean;
  mcpSignal: "confirmed" | "unconfirmed";
  topics: string[];
  existingSlug?: string;
};

export function SubmitForm() {
  const [url, setUrl] = useState("");
  const [note, setNote] = useState("");
  const [preview, setPreview] = useState<Preview | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState("");

  async function inspect() {
    setPending(true);
    setError("");
    setDone("");
    const response = await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ repoUrl: url }),
    });
    const body = (await response.json()) as { error?: string; preview?: Preview; slug?: string };
    setPending(false);
    if (!response.ok || !body.preview) {
      setPreview(null);
      setError(body.error ?? "The repository could not be read.");
      return;
    }
    setPreview(body.preview);
  }

  async function publish() {
    if (!preview) return;
    setPending(true);
    setError("");
    const response = await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ repoUrl: preview.repoUrl, note, confirm: true }),
    });
    const body = (await response.json()) as { error?: string; id?: string; slug?: string };
    setPending(false);
    if (response.status === 409 && body.slug) {
      setError("Already a plate.");
      return;
    }
    if (!response.ok || !body.id) {
      setError(body.error ?? "Not saved.");
      return;
    }
    setDone(body.id);
  }

  return (
    <div className="space-y-6">
      <label className="block">
        <span className="kicker">Repository URL</span>
        <input
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="https://github.com/owner/repo"
          className="mt-2 w-full border border-ink bg-verso px-3 py-3 font-mono text-sm outline-none"
        />
      </label>
      <button type="button" onClick={inspect} disabled={pending} className="border border-ink px-4 py-3 kicker">
        {pending ? "Reading GitHub" : "Fetch public metadata"}
      </button>
      {error ? <p className="text-oxblood">{error}</p> : null}
      {preview ? (
        <div className="border border-ink p-5">
          <p className="kicker">{preview.mcpSignal === "confirmed" ? "MCP signal in the public text" : "No MCP signal in the public text"}</p>
          <h2 className="mt-3 font-display text-4xl">{preview.name}</h2>
          <p className="mt-2">{preview.description || "GitHub has no description."}</p>
          <dl className="mt-4 grid grid-cols-2 gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-dust">
            <div>Language {preview.language ?? "unrecorded"}</div>
            <div>License {preview.license ?? "NOASSERTION"}</div>
            <div>Stars {preview.stars ?? "unrecorded"}</div>
            <div>{preview.archived ? "Archived" : "Not archived"}</div>
          </dl>
          {preview.mcpSignal === "unconfirmed" ? (
            <p className="mt-4 text-sm text-oxblood">
              The name, description, and topics do not mention MCP. You can still submit it. It stays pending and is not printed as a plate.
            </p>
          ) : null}
          {preview.existingSlug ? (
            <p className="mt-4">
              Already printed. <Link href={`/servers/${preview.existingSlug}`}>Open the plate</Link>
            </p>
          ) : (
            <>
              <label className="mt-4 block">
                <span className="kicker">Note for the editor, optional</span>
                <textarea value={note} onChange={(event) => setNote(event.target.value)} rows={3} className="mt-2 w-full border border-rule bg-paper px-3 py-2 outline-none" />
              </label>
              <button type="button" onClick={publish} disabled={pending} className="mt-4 border border-ink bg-ink px-4 py-3 kicker text-paper">
                Submit for the ledger
              </button>
            </>
          )}
        </div>
      ) : null}
      {done ? <p>Saved as a pending submission. It is not on the public shelf until an editor approves it.</p> : null}
    </div>
  );
}
