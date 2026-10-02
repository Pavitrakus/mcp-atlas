import type { Metadata } from "next";
import Link from "next/link";
import { Filters } from "@/components/filters";
import { SearchField } from "@/components/search-field";
import { ServerSlip } from "@/components/server-slip";
import { categories } from "@/data/categories";
import { parseFilters, searchServers, suggestStack } from "@/lib/search";
import { searchOfficialRegistry } from "@/sources/officialRegistry";

export const metadata: Metadata = {
  title: "Search",
  description: "Search MCP servers by task, name, or tool.",
};

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q : "";
  const filters = parseFilters(params);
  const found = query ? searchServers(query, filters) : { servers: [], confident: false };
  const stack = query ? suggestStack(query) : null;
  const registry = query ? await searchOfficialRegistry(query, 6) : [];

  return (
    <div className="mx-auto max-w-[1180px] px-5 py-10 md:px-8">
      <p className="kicker">Search</p>
      <h1 className="display mt-3 max-w-4xl text-5xl md:text-7xl">{query ? `“${query}”` : "What should it be able to do?"}</h1>
      <div className="mt-8">
        <SearchField initial={query} />
      </div>
      <div className="mt-10 grid gap-10 lg:grid-cols-12">
        <div className="order-2 lg:order-1 lg:col-span-3">
          <Filters filters={filters} base="/search" query={query || undefined} />
        </div>
        <div className="order-1 lg:order-2 lg:col-span-9">
          {stack ? (
            <section className="mb-8 border border-ink p-5">
              <p className="text-sm font-semibold">Related categories</p>
              <p className="mt-3 max-w-2xl">{stack.note}</p>
              <ul className="mt-4 flex flex-wrap gap-3">
                {stack.categories.map((slug) => {
                  const category = categories.find((item) => item.slug === slug);
                  return (
                    <li key={slug}>
                      <Link href={`/capabilities/${slug}`} className="kicker text-oxblood no-underline">
                        {category?.name ?? slug} ↗
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          ) : null}

          {query && !found.confident ? (
            <section className="mb-8 border-t border-oxblood pt-6">
              <p className="font-display text-4xl">No close match in Atlas.</p>
              <p className="mt-3 max-w-xl text-ink-soft">
                Try another term, or request the capability so builders can see what you need.
              </p>
              <Link
                href={`/requests/new?wish=${encodeURIComponent(query)}`}
                className="mt-5 inline-block border border-ink px-4 py-3 kicker no-underline"
              >
                Request this capability
              </Link>
            </section>
          ) : null}

          {found.servers.map((server) => (
            <ServerSlip key={server.slug} server={server} />
          ))}

          {registry.length > 0 ? (
            <section className="mt-12">
              <h2 className="font-display text-3xl">More from the official registry</h2>
              <p className="mt-2 max-w-2xl text-sm text-dust">
                These results come from the official MCP registry. Atlas has not reviewed their tools; check each project before installing.
              </p>
              <ul className="mt-4">
                {registry.map((hit) => (
                  <li key={hit.id} className="border-t border-rule py-3">
                    <p className="font-display text-2xl">{hit.title}</p>
                    <p className="text-sm text-ink-soft">{hit.description || "No description in the registry record."}</p>
                    <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-dust">
                      {hit.name}
                      {hit.status ? ` · ${hit.status}` : ""}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
