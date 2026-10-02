import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PlateImage } from "@/components/plate-image";
import { ServerSlip } from "@/components/server-slip";
import { categories, categoryBySlug } from "@/data/categories";
import { plateForCategory } from "@/data/plates";
import { serversInCategory } from "@/lib/catalog";

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = categoryBySlug.get(slug);
  if (!category) return { title: "Category not found" };
  return { title: category.name, description: category.summary };
}

export default async function CapabilityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categoryBySlug.get(slug);
  if (!category) notFound();
  const list = serversInCategory(slug);
  return (
    <div className="mx-auto max-w-[1180px] px-5 py-10 md:px-8">
      <p className="kicker">Category</p>
      <div className="mt-3 grid items-end gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h1 className="display text-6xl md:text-8xl">{category.name}</h1>
          <p className="mt-4 max-w-xl text-lg text-ink-soft">{category.summary}</p>
        </div>
        <div className="lg:col-span-5">
          <PlateImage plate={plateForCategory(category.slug)} priority />
        </div>
      </div>
      <div className="mt-10">
        {list.length === 0 ? (
          <div className="border-t border-oxblood py-8">
            <p className="font-display text-4xl">No servers here yet.</p>
            <Link href={`/requests/new?wish=${encodeURIComponent(`I want an assistant that can work with ${category.name.toLowerCase()}.`)}&title=${encodeURIComponent(category.name)}`} className="mt-4 inline-block kicker text-oxblood">
              Request it
            </Link>
          </div>
        ) : (
          list.map((server) => <ServerSlip key={server.slug} server={server} />)
        )}
      </div>
    </div>
  );
}
