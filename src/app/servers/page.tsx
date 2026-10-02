import type { Metadata } from "next";
import Link from "next/link";
import { Filters } from "@/components/filters";
import { ServerSlip } from "@/components/server-slip";
import { parseFilters, searchServers } from "@/lib/search";

export const metadata: Metadata = { title: "MCP servers", description: "Browse useful and unusual MCP servers by task, name, and permission." };

export default async function ServersPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const filters = parseFilters(params);
  const query = typeof params.q === "string" ? params.q : "";
  const found = searchServers(query, filters);
  return (
    <div className="home-wrap catalog-page">
      <header className="catalog-hero">
        <h1>Find an MCP server.</h1>
        <div className="catalog-hero__bottom">
          <p>Search by task or name. Check what a server can access before you connect it.</p>
          <form action="/servers" className="catalog-search"><label htmlFor="catalog-query" className="sr-only">Search servers</label><input id="catalog-query" type="search" name="q" defaultValue={query} placeholder="Try image generation, GitHub, or Minecraft" /><button type="submit" aria-label="Search servers">↗</button></form>
        </div>
      </header>
      <div className="catalog-layout">
        <details className="catalog-mobile-filters"><summary>Filter results</summary><div className="catalog-mobile-filters__body"><Filters filters={filters} base="/servers" query={query || undefined} /></div></details>
        <aside className="catalog-filters" id="filters"><p className="fresh-label">Filters</p><Filters filters={filters} base="/servers" query={query || undefined} /></aside>
        <div className="catalog-results"><div className="catalog-results__bar"><span>{found.servers.length} {found.servers.length === 1 ? "result" : "results"}</span><Link href="/servers">Clear filters ↗</Link></div>{found.servers.length === 0 ? <p className="border-t border-ink py-8">No servers match those filters.</p> : found.servers.map((server) => <ServerSlip key={server.slug} server={server} />)}</div>
      </div>
    </div>
  );
}
