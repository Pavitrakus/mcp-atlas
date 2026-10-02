"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const key = "atlas-audience";

export function AudienceGate() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (pathname === "/for-bots") return;
    const timer = window.setTimeout(() => {
      try { setOpen(!localStorage.getItem(key)); } catch { setOpen(true); }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  function choose(audience: "human" | "bot") {
    try { localStorage.setItem(key, audience); } catch { /* Navigation still works. */ }
    setOpen(false);
    router.push(audience === "bot" ? "/for-bots" : "/");
  }

  if (!open) return null;
  return <div className="audience-backdrop"><section className="audience-dialog" role="dialog" aria-modal="true" aria-labelledby="audience-title"><p className="fresh-label">Choose your view</p><h2 id="audience-title">Who&apos;s exploring?</h2><p>The same MCP directory in two useful formats.</p><div className="audience-options"><button type="button" onClick={() => choose("human")}><strong>I&apos;m a human</strong><span>Visual directory, guides, and search</span><b aria-hidden="true">↗</b></button><button type="button" onClick={() => choose("bot")}><strong>I&apos;m a bot</strong><span>Plain text, structured links, no imagery</span><b aria-hidden="true">↗</b></button></div></section></div>;
}
