import type { RegistryHit } from "@/lib/types";
import { servers } from "@/data/servers";

type RegistryServer = {
  server?: {
    name?: string;
    title?: string;
    description?: string;
    version?: string;
    websiteUrl?: string;
    repository?: { url?: string };
    remotes?: { type?: string; url?: string }[];
    packages?: { identifier?: string }[];
  };
  _meta?: {
    "io.modelcontextprotocol.registry/official"?: {
      status?: string;
      updatedAt?: string;
    };
  };
};

export function normalizeRegistryItem(item: RegistryServer): RegistryHit | null {
  const server = item.server;
  if (!server?.name) return null;
  const remote = server.remotes?.[0];
  return {
    id: server.name,
    name: server.name,
    title: server.title || server.name.split("/").pop() || server.name,
    description: server.description || "",
    version: server.version,
    repository: server.repository?.url,
    homepage: server.websiteUrl,
    remoteUrl: remote?.url,
    remoteType: remote?.type,
    packageName: server.packages?.[0]?.identifier,
    updatedAt: item._meta?.["io.modelcontextprotocol.registry/official"]?.updatedAt,
    status: item._meta?.["io.modelcontextprotocol.registry/official"]?.status,
  };
}

export function dedupeAgainstCatalog(hits: RegistryHit[]): RegistryHit[] {
  const repos = new Set(
    servers.map((server) => server.repository?.toLowerCase()).filter((value): value is string => Boolean(value)),
  );
  const urls = new Set<string>();
  for (const server of servers) {
    if (server.install.kind === "remote") urls.add(server.install.url.replace(/\/$/, ""));
    if (server.homepage) urls.add(server.homepage.replace(/\/$/, ""));
  }
  const seen = new Set<string>();
  const out: RegistryHit[] = [];
  for (const hit of hits) {
    if (seen.has(hit.id)) continue;
    const repoPath = githubPath(hit.repository);
    if (repoPath && repos.has(repoPath)) continue;
    if (hit.remoteUrl && urls.has(hit.remoteUrl.replace(/\/$/, ""))) continue;
    seen.add(hit.id);
    out.push(hit);
  }
  return out;
}

function githubPath(url?: string): string | null {
  if (!url) return null;
  const match = url.match(/github\.com\/([^/\s]+)\/([^/\s]+)/i);
  if (!match) return null;
  return `${match[1]}/${match[2]!.replace(/\.git$/, "")}`.toLowerCase();
}

export async function searchOfficialRegistry(query: string, limit = 8): Promise<RegistryHit[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];
  const endpoint = new URL("https://registry.modelcontextprotocol.io/v0.1/servers");
  endpoint.searchParams.set("search", trimmed.slice(0, 80));
  endpoint.searchParams.set("limit", String(limit));
  endpoint.searchParams.set("version", "latest");
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 4000);
  try {
    const response = await fetch(endpoint, {
      signal: controller.signal,
      headers: { Accept: "application/json", "User-Agent": "mcp-atlas" },
      cache: "no-store",
    });
    if (!response.ok) return [];
    const body = (await response.json()) as { servers?: RegistryServer[] };
    const normalized = (body.servers ?? [])
      .map((item) => normalizeRegistryItem(item))
      .filter((item): item is RegistryHit => Boolean(item));
    return dedupeAgainstCatalog(normalized);
  } catch {
    return [];
  } finally {
    clearTimeout(timer);
  }
}
