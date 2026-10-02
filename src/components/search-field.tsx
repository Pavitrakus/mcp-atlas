"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const EXAMPLES = [
  "control a browser",
  "query my database",
  "search academic papers",
  "understand Blender",
  "manage GitHub",
  "talk to my smart home",
  "read a PDF on my desk",
  "generate an image",
  "something nobody has built yet",
];

export function SearchField({ initial = "", large = false }: { initial?: string; large?: boolean }) {
  const [value, setValue] = useState(initial);
  const [example, setExample] = useState(0);
  const [motion, setMotion] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setMotion(!media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!motion) return;
    const timer = setInterval(() => setExample((index) => (index + 1) % EXAMPLES.length), 3200);
    return () => clearInterval(timer);
  }, [motion]);

  return (
    <form
      className="border-b border-ink"
      action="/search"
      onSubmit={(event) => {
        event.preventDefault();
        router.push(`/search?q=${encodeURIComponent(value.trim())}`);
      }}
    >
      <label className="block">
        <span className="sr-only">What do you want your AI to be able to do?</span>
        <textarea
          name="q"
          rows={1}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              event.currentTarget.form?.requestSubmit();
            }
          }}
          placeholder="What do you want your AI to be able to do?"
          className={`w-full resize-none bg-transparent text-ink outline-none placeholder:text-[#9a988e] ${large ? "py-3 font-sans text-2xl tracking-[-0.03em] sm:text-3xl md:text-4xl" : "py-3 font-sans text-2xl tracking-[-0.03em]"}`}
          aria-label="What do you want your AI to be able to do?"
        />
      </label>
      <div className="flex items-end justify-between gap-4 pb-3">
        <p className="min-w-0 flex-1 font-sans text-sm text-dust">{motion ? EXAMPLES[example] : EXAMPLES.join(" · ")}</p>
        <button type="submit" className="shrink-0 font-sans text-sm text-ink">
          Look
        </button>
      </div>
    </form>
  );
}
