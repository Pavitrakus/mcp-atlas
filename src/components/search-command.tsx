"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ServerMark } from "@/components/server-mark";

type Hit = { slug: string; name: string; summary: string };

export function SearchCommand() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const titleId = useId();
  const router = useRouter();

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const typing = Boolean(target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable));
      const slash = !event.metaKey && !event.ctrlKey && !event.altKey && (event.key === "/" || event.code === "Slash");
      const command = (event.metaKey || event.ctrlKey) && !event.altKey && (event.key === "k" || event.key === "K" || event.code === "KeyK");
      if ((slash && !typing) || command) {
        event.preventDefault();
        setOpen(true);
      }
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handle = setTimeout(async () => {
      setLoading(true);
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=8`);
      const body = (await response.json()) as { servers: Hit[] };
      setHits(body.servers ?? []);
      setActive(0);
      setLoading(false);
    }, 80);
    return () => clearTimeout(handle);
  }, [query, open]);

  function go(index = active) {
    const hit = hits[index];
    if (hit) {
      setOpen(false);
      router.push(`/servers/${hit.slug}`);
      return;
    }
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  }

  return (
    <>
      <button type="button" className="kicker hover:text-ink" onClick={() => setOpen(true)} aria-keyshortcuts="/ Control+K">
        Search
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-[#171714]/40 px-4 pt-[12vh]" role="presentation" onMouseDown={() => setOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="paper-slip w-full max-w-xl shadow-none"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <p id={titleId} className="kicker border-b border-rule px-4 py-3">
              What should it be able to do
            </p>
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  setActive((value) => Math.min(value + 1, Math.max(hits.length - 1, 0)));
                } else if (event.key === "ArrowUp") {
                  event.preventDefault();
                  setActive((value) => Math.max(value - 1, 0));
                } else if (event.key === "Enter") {
                  event.preventDefault();
                  go();
                }
              }}
              placeholder="control a browser, query a database…"
              className="w-full bg-transparent px-4 py-4 font-display text-3xl text-ink outline-none placeholder:text-dust/70"
              aria-label="Search the atlas"
            />
            <div className="h-px bg-oxblood" style={{ width: loading ? "100%" : "0%", transition: "width 180ms linear" }} />
            <ul className="max-h-80 overflow-auto border-t border-rule">
              {hits.map((hit, index) => (
                <li key={hit.slug}>
                  <button
                    type="button"
                    className={`flex w-full items-start gap-4 px-4 py-3 text-left ${index === active ? "bg-paper-deep" : ""}`}
                    onMouseEnter={() => setActive(index)}
                    onClick={() => go(index)}
                  >
                    <ServerMark slug={hit.slug} name={hit.name} />
                    <span>
                      <span className="block font-display text-2xl leading-none">{hit.name}</span>
                      <span className="mt-1 block text-sm text-dust">{hit.summary}</span>
                    </span>
                  </button>
                </li>
              ))}
              {query && hits.length === 0 && !loading ? (
                <li className="px-4 py-4 text-sm">
                  No matching server.{" "}
                  <button type="button" className="underline" onClick={() => go()}>
                    Open the full search
                  </button>
                </li>
              ) : null}
            </ul>
            <p className="kicker border-t border-rule px-4 py-2">/ or ctrl K · esc · enter</p>
          </div>
        </div>
      ) : null}
    </>
  );
}
