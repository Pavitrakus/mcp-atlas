export default function Loading() {
  return (
    <div className="mx-auto max-w-[1180px] px-5 py-16 md:px-8" aria-busy="true" aria-live="polite">
      <p className="kicker">Opening the plate</p>
      <div className="mt-6 space-y-3">
        <div className="h-3 w-40 bg-paper-deep" />
        <div className="h-12 w-2/3 bg-paper-deep" />
        <div className="h-px w-full bg-rule" />
        <div className="h-px w-full bg-rule" />
        <div className="h-px w-4/5 bg-rule" />
      </div>
    </div>
  );
}
