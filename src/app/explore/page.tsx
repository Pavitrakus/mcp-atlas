import type { Metadata } from "next";
import Link from "next/link";
import { Astrolabe } from "@/components/astrolabe";
import { categories } from "@/data/categories";
import { categoryCounts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Explore",
  description: "Browse MCP servers by what they help you do.",
};

const OUTER = ["search", "research", "knowledge", "databases", "code", "browsers", "design", "creative-tools", "media", "communication", "local-systems", "science"];
const INNER = ["finance", "devops", "security", "robotics", "games", "geospatial", "productivity", "social", "computation", "other"];

export default function ExplorePage() {
  const counts = categoryCounts();
  const nodes = [...OUTER, ...INNER]
    .map((slug) => categories.find((category) => category.slug === slug))
    .filter((category) => category != null)
    .map((category) => ({
      slug: category.slug,
      name: category.name,
      count: counts.get(category.slug) ?? 0,
      ring: (OUTER.includes(category.slug) ? "outer" : "inner") as "outer" | "inner",
    }));
  return (
    <div className="mx-auto max-w-[1180px] px-5 py-10 md:px-8">
      <p className="kicker">Browse categories</p>
      <h1 className="display mt-3 text-6xl md:text-8xl">Explore</h1>
      <p className="mt-4 max-w-xl text-ink-soft">Choose a category in the chart or list to find relevant servers.</p>
      <div className="mt-10">
        <Astrolabe nodes={nodes} />
      </div>
      <ol className="mt-12 columns-1 gap-x-10 sm:columns-2">
        {categories.map((category) => (
          <li key={category.slug} className="break-inside-avoid border-t border-rule py-3">
            <Link href={`/capabilities/${category.slug}`} className="flex items-baseline justify-between gap-4 no-underline">
              <span className="font-display text-2xl">{category.name}</span>
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-dust">{counts.get(category.slug) ?? 0}</span>
            </Link>
            <p className="text-sm text-dust">{category.summary}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
