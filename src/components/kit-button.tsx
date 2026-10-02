"use client";

import { useEffect, useState } from "react";

const KEY = "atlas.kit";

export function readKit(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? "[]") as unknown;
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export function writeKit(slugs: string[]) {
  localStorage.setItem(KEY, JSON.stringify([...new Set(slugs)]));
  window.dispatchEvent(new Event("atlas-kit"));
}

export function KitButton({ slug }: { slug: string }) {
  const [inKit, setInKit] = useState(false);
  useEffect(() => {
    const sync = () => setInKit(readKit().includes(slug));
    sync();
    window.addEventListener("atlas-kit", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("atlas-kit", sync);
      window.removeEventListener("storage", sync);
    };
  }, [slug]);
  return (
    <button
      type="button"
      className="text-sm font-semibold text-oxblood"
      onClick={() => {
        const current = readKit();
        writeKit(inKit ? current.filter((item) => item !== slug) : [...current, slug]);
      }}
    >
      {inKit ? "Saved ✓" : "Save server +"}
    </button>
  );
}
