import type { Metadata } from "next";
import Link from "next/link";
import { maintainers } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Maintainers",
  description: "Explore the maintainers behind listed MCP servers.",
};

export default function BuildersPage() {
  const people = maintainers();
  return (
    <div className="mx-auto max-w-[1180px] px-5 py-10 md:px-8">
      <p className="kicker">Maintainers</p>
      <h1 className="display mt-3 text-6xl md:text-8xl">Maintainers</h1>
      <p className="mt-4 max-w-xl text-ink-soft">The people and teams behind the servers in Atlas.</p>
      <ul className="mt-10 border-t border-ink">
        {people.map((person) => (
          <li key={person.slug} className="grid gap-2 border-b border-rule py-4 md:grid-cols-12">
            <Link href={`/builders/${person.slug}`} className="font-display text-3xl no-underline md:col-span-4">
              {person.name}
            </Link>
            <p className="text-ink-soft md:col-span-8">{person.servers.map((server) => server.name).join(", ")}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
