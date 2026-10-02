import type { Metadata } from "next";
import Link from "next/link";
import { servers } from "@/data/servers";
import { getServer, licenseOf, maintenanceOf } from "@/lib/catalog";
import { trustReport } from "@/lib/trust";

export const metadata: Metadata = { title: "Compare", description: "Compare MCP servers side by side." };

export default async function ComparePage({ searchParams }: { searchParams: Promise<{ ids?: string }> }) {
  const params = await searchParams;
  const ids = (params.ids ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean)
    .slice(0, 3);
  const chosen = ids.map((id) => getServer(id)).filter((server) => server != null);

  return (
    <div className="mx-auto max-w-[1180px] px-5 py-10 md:px-8">
      <p className="kicker">Comparison</p>
      <h1 className="display mt-3 text-6xl">Side by side</h1>
      <form className="mt-6 flex flex-wrap gap-3" action="/compare">
        <label className="sr-only" htmlFor="ids">
          Slugs, separated by commas
        </label>
        <input
          id="ids"
          name="ids"
          defaultValue={ids.join(",")}
          placeholder="playwright, chrome-devtools"
          className="min-w-0 flex-1 border border-ink bg-verso px-3 py-3 font-mono text-sm outline-none"
        />
        <button type="submit" className="border border-ink px-4 py-3 kicker">
          Compare
        </button>
      </form>
      {chosen.length === 0 ? (
        <p className="mt-8 text-dust">Name two or three slugs. For example playwright, github, filesystem.</p>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-ink">
                <th className="py-3 pr-4 kicker font-normal">Field</th>
                {chosen.map((server) => (
                  <th key={server.slug} className="py-3 pr-4 font-display text-3xl font-normal">
                    <Link href={`/servers/${server.slug}`} className="no-underline">
                      {server.name}
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <Row label="Summary" cells={chosen.map((server) => server.summary)} />
              <Row label="Hosting" cells={chosen.map((server) => server.hosting)} />
              <Row label="Auth" cells={chosen.map((server) => (server.auth.required ? "Credential" : "No third-party key"))} />
              <Row label="Transport" cells={chosen.map((server) => server.transports.join(", "))} />
              <Row label="License" cells={chosen.map((server) => licenseOf(server) ?? "Unobserved")} />
              <Row label="Maintenance" cells={chosen.map((server) => maintenanceOf(server))} />
              <Row label="Tools transcribed" cells={chosen.map((server) => String(server.tools.length))} />
              <Row label="Cautions" cells={chosen.map((server) => trustReport(server).cautions.join(" ") || "None recorded")} />
            </tbody>
          </table>
        </div>
      )}
      <p className="mt-8 text-sm text-dust">{servers.length} servers listed. Add servers from their detail pages.</p>
    </div>
  );
}

function Row({ label, cells }: { label: string; cells: string[] }) {
  return (
    <tr className="border-b border-rule align-top">
      <th className="py-3 pr-4 kicker font-normal">{label}</th>
      {cells.map((cell, index) => (
        <td key={`${label}-${index}`} className="py-3 pr-4">
          {cell}
        </td>
      ))}
    </tr>
  );
}
