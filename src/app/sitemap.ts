import type { MetadataRoute } from "next";
import { categories } from "@/data/categories";
import { servers } from "@/data/servers";
import { wantedSeeds } from "@/data/wanted";
import { maintainers } from "@/lib/catalog";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.ATLAS_PUBLIC_URL ?? "http://127.0.0.1:43123";
  const staticPaths = ["", "/explore", "/capabilities", "/servers", "/requests", "/requests/new", "/submit", "/about", "/kit", "/compare", "/builders", "/legal/terms", "/legal/privacy"];
  return [
    ...staticPaths.map((path) => ({ url: `${base}${path || "/"}` })),
    ...servers.map((server) => ({ url: `${base}/servers/${server.slug}` })),
    ...categories.map((category) => ({ url: `${base}/capabilities/${category.slug}` })),
    ...wantedSeeds.map((seed) => ({ url: `${base}/requests/${seed.slug}` })),
    ...maintainers().map((person) => ({ url: `${base}/builders/${person.slug}` })),
  ];
}
