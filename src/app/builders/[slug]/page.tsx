import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ServerSlip } from "@/components/server-slip";
import { maintainerBySlug, maintainers } from "@/lib/catalog";

export function generateStaticParams() {
  return maintainers().map((person) => ({ slug: person.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const person = maintainerBySlug(slug);
  if (!person) return { title: "Missing maintainer" };
  return { title: person.name, description: `MCP servers maintained by ${person.name}.` };
}

export default async function BuilderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const person = maintainerBySlug(slug);
  if (!person) notFound();
  const languages = [...new Set(person.servers.flatMap((server) => server.categories))];
  return (
    <div className="mx-auto max-w-[1180px] px-5 py-10 md:px-8">
      <p className="kicker">Maintainer</p>
      <h1 className="display mt-3 text-6xl">{person.name}</h1>
      <p className="mt-4 max-w-xl text-ink-soft">
        {person.servers.length} {person.servers.length === 1 ? "server" : "servers"}. Categories: {languages.join(", ")}.
      </p>
      <p className="mt-2 text-sm">
        <Link href="/builders">All maintainers</Link>
      </p>
      <div className="mt-8">
        {person.servers.map((server) => (
          <ServerSlip key={server.slug} server={server} />
        ))}
      </div>
    </div>
  );
}
