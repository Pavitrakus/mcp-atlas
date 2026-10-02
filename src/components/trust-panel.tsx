import { trustReport } from "@/lib/trust";
import type { ServerRecord } from "@/lib/types";

export function TrustPanel({ server }: { server: ServerRecord }) {
  const report = trustReport(server);
  return (
    <section aria-labelledby="trust-heading">
      <h2 id="trust-heading" className="kicker">
        Trust, as evidence
      </h2>
      <p className="mt-2 text-sm text-dust">Observed {report.observedOn}. A star count is not a verdict.</p>
      <dl className="mt-4">
        {report.lines.map((line) => (
          <div key={line.label} className="grid grid-cols-[7rem_1fr] gap-3 border-t border-rule py-2 text-sm">
            <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-dust">{line.label}</dt>
            <dd className={line.tone === "caution" ? "text-oxblood" : "text-ink"}>{line.value}</dd>
          </div>
        ))}
      </dl>
      {report.cautions.length > 0 ? (
        <div className="mt-4 border border-oxblood/40 bg-verso p-4">
          <p className="kicker text-oxblood">Caution</p>
          <ul className="mt-2 space-y-2 text-sm">
            {report.cautions.map((caution) => (
              <li key={caution}>{caution}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
