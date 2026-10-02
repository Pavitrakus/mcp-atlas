import { NextResponse } from "next/server";
import { plateNumber } from "@/lib/catalog";
import { parseFilters, searchServers, suggestStack } from "@/lib/search";
import { dedupeAgainstCatalog, searchOfficialRegistry } from "@/sources/officialRegistry";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q") ?? "";
  const limit = Math.min(Number(url.searchParams.get("limit") ?? 24) || 24, 50);
  const filters = parseFilters(Object.fromEntries(url.searchParams.entries()));
  const found = searchServers(query, filters);
  const payload: Record<string, unknown> = {
    query,
    confident: found.confident,
    stack: suggestStack(query),
    servers: found.servers.slice(0, limit).map((server) => ({
      slug: server.slug,
      name: server.name,
      summary: server.summary,
      plate: `Plate ${plateNumber(server)}`,
      categories: server.categories,
      hosting: server.hosting,
      authRequired: server.auth.required,
    })),
  };
  if (url.searchParams.get("live") === "1" && query.trim()) {
    const hits = await searchOfficialRegistry(query);
    payload.registry = dedupeAgainstCatalog(hits).slice(0, 8);
  }
  return NextResponse.json(payload);
}
