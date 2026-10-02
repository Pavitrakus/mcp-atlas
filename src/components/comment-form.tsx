"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function CommentForm({ slug }: { slug: string }) {
  const router = useRouter();
  const [error, setError] = useState("");

  return (
    <form
      className="mt-4 space-y-3"
      onSubmit={async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const body = String(new FormData(form).get("body") ?? "");
        const author = String(new FormData(form).get("author") ?? "");
        const response = await fetch(`/api/requests/${slug}/comments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ body, author }),
        });
        if (!response.ok) {
          const payload = (await response.json()) as { error?: string };
          setError(payload.error ?? "The note was not kept.");
          return;
        }
        form.reset();
        setError("");
        router.refresh();
      }}
    >
      <label className="block">
        <span className="kicker">A note for builders</span>
        <textarea name="body" required rows={4} className="mt-2 w-full border border-ink bg-verso px-3 py-3 outline-none" />
      </label>
      <label className="block">
        <span className="kicker">Name, optional</span>
        <input name="author" className="mt-2 w-full border border-rule bg-verso px-3 py-2 outline-none" />
      </label>
      {error ? <p className="text-sm text-oxblood">{error}</p> : null}
      <button type="submit" className="kicker text-oxblood">
        Leave the note
      </button>
    </form>
  );
}
