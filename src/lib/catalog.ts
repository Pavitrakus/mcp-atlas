import { categories, categoryBySlug } from "@/data/categories";
import { OBSERVED_ON, observations } from "@/data/observations";
import { serverBySlug, servers } from "@/data/servers";
import type { Observation, ServerRecord } from "@/lib/types";

export { categories, categoryBySlug, OBSERVED_ON, servers };

const OSI = new Set([
  "MIT",
  "Apache-2.0",
  "BSD-2-Clause",
  "BSD-3-Clause",
  "ISC",
  "MPL-2.0",
  "GPL-2.0",
  "GPL-3.0",
  "LGPL-2.1",
  "LGPL-3.0",
  "AGPL-3.0",
  "Unlicense",
  "0BSD",
]);

export function getServer(slug: string): ServerRecord | undefined {
  return serverBySlug.get(slug);
}

export function observationFor(server: ServerRecord): Observation | undefined {
  if (!server.repository) return undefined;
  return observations[server.repository];
}

export function plateNumber(server: ServerRecord): string {
  const index = servers.findIndex((item) => item.slug === server.slug);
  return String(index + 1).padStart(3, "0");
}

export function isOsiLicense(license: string | null | undefined): boolean {
  if (!license || license === "NOASSERTION") return false;
  return OSI.has(license);
}

export function daysSince(date: string, today = "2026-10-02"): number {
  const a = Date.parse(`${date}T00:00:00Z`);
  const b = Date.parse(`${today}T00:00:00Z`);
  return Math.round((b - a) / 86_400_000);
}

export function maintenanceOf(server: ServerRecord, today = "2026-10-02"): "recent" | "quiet" | "archived" | "unknown" {
  const observed = observationFor(server);
  if (!observed) return "unknown";
  if (observed.archived) return "archived";
  return daysSince(observed.pushedAt, today) <= 120 ? "recent" : "quiet";
}

export function languageOf(server: ServerRecord): string | null {
  return observationFor(server)?.language ?? null;
}

export function licenseOf(server: ServerRecord): string | null {
  return observationFor(server)?.license ?? null;
}

export function serversInCategory(slug: string): ServerRecord[] {
  return servers.filter((server) => server.categories.includes(slug));
}

export function relatedServers(server: ServerRecord): ServerRecord[] {
  return server.related.map((slug) => serverBySlug.get(slug)).filter((item): item is ServerRecord => Boolean(item));
}

export function categoryCounts(): Map<string, number> {
  const counts = new Map<string, number>();
  for (const category of categories) counts.set(category.slug, 0);
  for (const server of servers) {
    for (const slug of server.categories) {
      counts.set(slug, (counts.get(slug) ?? 0) + 1);
    }
  }
  return counts;
}

export function maintainers(): { slug: string; name: string; servers: ServerRecord[] }[] {
  const groups = new Map<string, ServerRecord[]>();
  for (const server of servers) {
    const list = groups.get(server.maintainer) ?? [];
    list.push(server);
    groups.set(server.maintainer, list);
  }
  return [...groups.entries()]
    .map(([name, list]) => ({
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      name,
      servers: list,
    }))
    .sort((a, b) => b.servers.length - a.servers.length || a.name.localeCompare(b.name));
}

export function maintainerBySlug(slug: string) {
  return maintainers().find((maintainer) => maintainer.slug === slug);
}
