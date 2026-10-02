import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { InstallPanel } from "@/components/install-panel";
import { PlateImage } from "@/components/plate-image";
import { ServerSlip } from "@/components/server-slip";
import { ServerMark } from "@/components/server-mark";
import { ToolList } from "@/components/tool-list";
import { plateForCategories } from "@/data/plates";
import { getServer, relatedServers } from "@/lib/catalog";
import { servers } from "@/data/servers";

export function generateStaticParams() {
  return servers.map((server) => ({ slug: server.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const server = getServer(slug);
  if (!server) return { title: "Server not found" };
  return {
    title: server.name,
    description: server.summary,
    openGraph: { title: server.name, description: server.gives },
  };
}

export default async function ServerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const server = getServer(slug);
  if (!server) notFound();
  const related = relatedServers(server);
  const plate = plateForCategories(server.categories);
  const sourceLinks = [...new Set([
    ...(server.repository ? [`https://github.com/${server.repository}`] : []),
    ...(server.homepage ? [server.homepage] : []),
    ...server.sourceUrls,
  ].map((url) => url.replace(/\/$/, "")))];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: server.name,
    description: server.summary,
    applicationCategory: "DeveloperApplication",
    ...(server.repository ? { codeRepository: `https://github.com/${server.repository}` } : {}),
  };

  return (
    <article className="mx-auto max-w-[1180px] px-5 py-10 md:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="mt-3 grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <div className="server-detail-title"><ServerMark slug={server.slug} name={server.name} size="large" /><h1 className="display">{server.name}</h1></div>
          <p className="mt-4 max-w-2xl text-xl text-ink-soft">{server.summary}</p>
        </div>
        <div className="lg:col-span-4">
          <PlateImage plate={plate} priority />
        </div>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-12">
        <div className="order-2 min-w-0 space-y-12 lg:order-1 lg:col-span-7">
          <section>
            <h2 className="kicker">What it gives an assistant</h2>
            <p className="mt-3 max-w-2xl font-display text-3xl leading-snug">{server.gives}</p>
          </section>
          <section>
            <h2 className="kicker">Use</h2>
            <ul className="mt-3 max-w-xl space-y-2">
              {server.useCases.map((useCase) => (
                <li key={useCase} className="border-t border-rule py-2">
                  {useCase}
                </li>
              ))}
            </ul>
          </section>
          <ToolList server={server} />
          {server.resources.length > 0 ? (
            <section>
              <h2 className="font-display text-4xl">Resources</h2>
              <ul className="mt-3">
                {server.resources.map((resource) => (
                  <li key={resource.name} className="border-t border-rule py-2">
                    <span className="font-mono text-sm">{resource.name}</span>
                    <span className="mt-1 block text-sm text-dust">{resource.summary}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          <section>
            <h2 className="kicker">Source</h2>
            <ul className="mt-3 space-y-2">
              {sourceLinks.map((url) => (
                <li key={url}>
                  <a href={url}>{url.replace(/^https?:\/\//, "")}</a>
                </li>
              ))}
            </ul>
          </section>
        </div>
        <div className="order-1 min-w-0 space-y-8 lg:order-2 lg:col-span-5 lg:sticky lg:top-20 lg:self-start">
          <InstallPanel server={server} />
          <p className="text-sm">
            <Link href={`/compare?ids=${server.slug}`}>Compare this server</Link>
          </p>
        </div>
      </div>

      {related.length > 0 ? (
        <section className="mt-16">
          <h2 className="font-display text-4xl">Similar servers</h2>
          <div className="mt-2">
            {related.map((item) => (
              <ServerSlip key={item.slug} server={item} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
