"use client";

import { useState } from "react";

export function VoteButton({ slug, votes }: { slug: string; votes: number }) {
  const [count, setCount] = useState(votes);
  const [note, setNote] = useState("");

  return (
    <div>
      <button
        type="button"
        className="border border-ink px-4 py-3 kicker"
        onClick={async () => {
          const response = await fetch(`/api/requests/${slug}/vote`, { method: "POST" });
          const body = (await response.json()) as { votes?: number; already?: boolean };
          if (typeof body.votes === "number") setCount(body.votes);
          setNote(body.already ? "This browser already voted." : "Recorded on this copy of the Atlas.");
        }}
      >
        I want this · {count}
      </button>
      {note ? <p className="mt-2 text-sm text-dust">{note}</p> : null}
    </div>
  );
}
