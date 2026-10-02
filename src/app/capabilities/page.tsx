import type { Metadata } from "next";
import Link from "next/link";
import { categories } from "@/data/categories";
import { categoryCounts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Capabilities",
  description: "Browse MCP servers by task and category.",
};

export default function CapabilitiesPage() {
  const counts = categoryCounts();
  return (
    <div className="mx-auto max-w-[1180px] px-5 py-10 md:px-8">
      <p className="kicker">Browse categories</p>
      <h1 className="display mt-3 text-6xl md:text-8xl">Capabilities</h1>
      <p className="mt-4 max-w-xl text-lg text-ink-soft">
        Pick a task to see the servers that support it.
      </p>
      <div className="mt-10 border-t border-ink">
        {categories.map((category) => {
          const count = counts.get(category.slug) ?? 0;
          return (
            <Link key={category.slug} href={`/capabilities/${category.slug}`} className="grid grid-cols-12 items-center gap-4 border-b border-rule py-4 no-underline">
              <span className="col-span-9 font-display text-4xl">{category.name}</span>
              <span className="col-span-3 text-right text-sm text-dust">
                {count === 0 ? "No servers yet" : `${count} ${count === 1 ? "server" : "servers"}`} ↗
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
