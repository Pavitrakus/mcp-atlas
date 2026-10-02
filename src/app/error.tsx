"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-xl px-5 py-16 md:px-8">
      <p className="kicker">Fault</p>
      <h1 className="display mt-3 text-5xl">This plate did not open.</h1>
      <p className="mt-4 text-ink-soft">The page failed while rendering. The catalog itself is still on disk.</p>
      <button type="button" onClick={reset} className="mt-6 border border-ink px-4 py-3 kicker">
        Try again
      </button>
    </div>
  );
}
