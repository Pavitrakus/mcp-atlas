import { categories } from "@/data/categories";
import { servers } from "@/data/servers";
import { languageOf, licenseOf, maintenanceOf, observationFor } from "@/lib/catalog";
import type { SearchFilters, ServerRecord, StackSuggestion } from "@/lib/types";

const SYNONYMS: Record<string, string[]> = {
  database: ["postgres", "sql", "sqlite", "mongo", "redis"],
  postgres: ["database", "sql"],
  sql: ["postgres", "database"],
  browser: ["playwright", "chrome", "puppeteer"],
  website: ["browser", "playwright", "fetch", "crawl"],
  papers: ["arxiv", "research", "pdf"],
  paper: ["arxiv", "pdf", "pandoc"],
  pdf: ["markdownify", "pandoc", "document"],
  github: ["git", "repository", "pull"],
  repo: ["github", "git"],
  notes: ["obsidian", "notion", "memory"],
  home: ["assistant", "smart"],
  "3d": ["blender"],
  model: ["blender", "huggingface"],
  music: ["ableton", "spotify"],
  game: ["minecraft", "godot", "unity"],
  docs: ["context7", "documentation"],
  documentation: ["context7"],
  invoice: ["stripe", "billing"],
  billing: ["stripe"],
  error: ["sentry"],
  logs: ["grafana", "sentry"],
  container: ["docker", "kubernetes"],
  cluster: ["kubernetes"],
  vector: ["qdrant", "chroma"],
  weather: ["forecast", "meteo"],
  design: ["figma"],
  chat: ["slack"],
  tasks: ["todoist", "linear", "jira"],
  issues: ["github", "jira", "linear", "sentry"],
};

const STACKS: { test: RegExp; categories: string[]; note: string }[] = [
  {
    test: /support|inbox|customer|ticket/,
    categories: ["communication", "knowledge", "search", "productivity"],
    note: "A support desk usually wants a place people write, a place the answers live, and a way to read the public web.",
  },
  {
    test: /paper|citation|literature|arxiv|research/,
    categories: ["research", "knowledge", "media"],
    note: "A research stack is a paper shelf, a note vault, and a way to turn PDFs into text.",
  },
  {
    test: /startup|billing|stripe|customer/,
    categories: ["finance", "productivity", "communication", "databases"],
    note: "A small company stack often starts with the ledger, the issue tracker, and the database behind the product.",
  },
  {
    test: /deploy|kubernetes|infra|server/,
    categories: ["devops", "security", "databases"],
    note: "An operations stack is the cluster, the dashboard, and a careful look at what the tools are allowed to change.",
  },
  {
    test: /design|figma|front.?end|ui/,
    categories: ["design", "browsers", "code"],
    note: "Implementing a design wants the file, a browser to check the result, and the repository.",
  },
  {
    test: /3d|blender|model|scene/,
    categories: ["creative-tools"],
    note: "The scene is local. The server has to talk to the program that already has the file open.",
  },
];

export function tokenize(query: string): string[] {
  return query
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .split(/[\s/]+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 1 && !STOP.has(token));
}

const STOP = new Set(["a", "an", "the", "to", "my", "me", "i", "want", "ai", "mcp", "that", "lets", "let", "can", "do", "of", "for", "and", "with", "into", "on", "in", "it", "be", "able"]);

function haystack(server: ServerRecord): { field: string; weight: number; text: string }[] {
  return [
    { field: "name", weight: 28, text: server.name },
    { field: "slug", weight: 22, text: server.slug.replace(/-/g, " ") },
    { field: "summary", weight: 12, text: server.summary },
    { field: "gives", weight: 10, text: server.gives },
    { field: "tags", weight: 14, text: server.tags.join(" ") },
    { field: "use", weight: 12, text: server.useCases.join(" ") },
    { field: "tools", weight: 11, text: server.tools.map((tool) => `${tool.name} ${tool.summary}`).join(" ") },
    { field: "categories", weight: 8, text: server.categories.join(" ") },
    { field: "maintainer", weight: 6, text: server.maintainer },
  ];
}

export function scoreServer(server: ServerRecord, rawQuery: string): number {
  const original = tokenize(rawQuery);
  if (original.length === 0) return 0;
  const fields = haystack(server);
  let score = 0;
  let covered = 0;
  for (const token of original) {
    const candidates = [token, ...(SYNONYMS[token] ?? [])];
    let best = 0;
    for (const candidate of candidates) {
      for (const field of fields) {
        if (includesTerm(field.text, candidate)) best = Math.max(best, field.weight);
      }
    }
    if (best > 0) {
      covered += 1;
      score += best;
    }
  }
  if (covered === original.length && original.length > 1) score += 8;
  if (server.name.toLowerCase() === rawQuery.trim().toLowerCase()) score += 40;
  return score;
}

function includesTerm(haystackText: string, needle: string): boolean {
  const words = haystackText.toLowerCase().split(/[^a-z0-9+#]+/).filter(Boolean);
  return words.some((word) => {
    if (word === needle) return true;
    const shorter = word.length < needle.length ? word : needle;
    const longer = word.length < needle.length ? needle : word;
    if (shorter.length < 5 || !longer.startsWith(shorter)) return false;
    return longer.length - shorter.length <= 3;
  });
}

export function suggestStack(query: string): StackSuggestion | null {
  for (const stack of STACKS) {
    if (stack.test.test(query.toLowerCase())) {
      return { categories: stack.categories, note: stack.note };
    }
  }
  return null;
}

export function searchServers(query: string, filters: SearchFilters = {}): { servers: ServerRecord[]; confident: boolean } {
  const filtered = servers.filter((server) => matchesFilters(server, filters));
  const trimmed = query.trim();
  if (!trimmed) {
    return { servers: filtered, confident: true };
  }
  const ranked = filtered
    .map((server) => ({ server, score: scoreServer(server, trimmed) }))
    .filter((item) => item.score >= 18)
    .sort((a, b) => b.score - a.score || a.server.name.localeCompare(b.server.name));
  return { servers: ranked.map((item) => item.server), confident: ranked.length > 0 && ranked[0]!.score >= 28 };
}

export function matchesFilters(server: ServerRecord, filters: SearchFilters): boolean {
  if (filters.category && !server.categories.includes(filters.category)) return false;
  if (filters.transport && !server.transports.includes(filters.transport)) return false;
  if (filters.credential === "none" && server.auth.required) return false;
  if (filters.credential === "required" && !server.auth.required) return false;
  if (filters.hosting === "local" && server.hosting === "remote") return false;
  if (filters.hosting === "remote" && server.hosting === "local") return false;
  if (filters.language && languageOf(server) !== filters.language) return false;
  if (filters.license && licenseOf(server) !== filters.license) return false;
  if (filters.weird && !server.weird) return false;
  if (filters.official && !server.official) return false;
  if (filters.maintenance && maintenanceOf(server) !== filters.maintenance) return false;
  return true;
}

export function parseFilters(params: Record<string, string | string[] | undefined>): SearchFilters {
  const one = (key: string) => {
    const value = params[key];
    return Array.isArray(value) ? value[0] : value;
  };
  const category = one("category");
  const transport = one("transport");
  const credential = one("credential");
  const hosting = one("hosting");
  const maintenance = one("maintenance");
  return {
    category: category && categories.some((item) => item.slug === category) ? category : undefined,
    transport: transport === "stdio" || transport === "sse" || transport === "streamable-http" ? transport : undefined,
    credential: credential === "none" || credential === "required" ? credential : undefined,
    hosting: hosting === "local" || hosting === "remote" ? hosting : undefined,
    language: one("language") || undefined,
    license: one("license") || undefined,
    weird: one("weird") === "1" ? true : undefined,
    official: one("official") === "1" ? true : undefined,
    maintenance: maintenance === "recent" || maintenance === "quiet" || maintenance === "archived" ? maintenance : undefined,
  };
}

export function languagesInCatalog(): string[] {
  const set = new Set<string>();
  for (const server of servers) {
    const language = languageOf(server);
    if (language) set.add(language);
  }
  return [...set].sort();
}

export function licensesInCatalog(): string[] {
  const set = new Set<string>();
  for (const server of servers) {
    const license = licenseOf(server);
    if (license) set.add(license);
  }
  return [...set].sort();
}

export function sortByPush(list: ServerRecord[]): ServerRecord[] {
  return [...list].sort((a, b) => {
    const ap = observationFor(a)?.pushedAt ?? "";
    const bp = observationFor(b)?.pushedAt ?? "";
    return bp.localeCompare(ap);
  });
}
