import Image from "next/image";
import Link from "next/link";
import { SearchField } from "@/components/search-field";
import { ServerMark } from "@/components/server-mark";
import { ServerSlip } from "@/components/server-slip";
import { HomeJournal } from "@/components/home-journal";
import { PlateImage } from "@/components/plate-image";
import { plates } from "@/data/plates";
import { servers } from "@/data/servers";
import { listRequests } from "@/lib/ledger";

export const dynamic = "force-dynamic";

const doorways = [
  { slug: "code", title: "Build & ship", note: "Repositories, browsers, terminals, and the work around them.", plate: plates.loom },
  { slug: "knowledge", title: "Find & know", note: "Search, notes, papers, and answers with a source.", plate: plates.archive },
  { slug: "creative-tools", title: "Make & play", note: "Design files, music studios, game worlds, and images.", plate: plates.studio },
  { slug: "local-systems", title: "Use your workspace", note: "Files, devices, and the machine on your desk.", plate: plates.house },
];
const featuredSlugs = ["github", "playwright", "pollinations", "weather", "blender", "minecraft"];

export default function HomePage() {
  const featured = featuredSlugs.flatMap((slug) => servers.find((server) => server.slug === slug) ?? []);
  const more = ["filesystem", "brave-search", "memory"].flatMap((slug) => servers.find((server) => server.slug === slug) ?? []);
  const wanted = listRequests().slice(0, 3);

  return <div className="home restored-home">
    <section className="home-hero" aria-labelledby="home-title">
      <div className="home-wrap home-hero__top">
        <div className="home-hero__grid">
          <h1 id="home-title">Your AI can do<br />more than talk.</h1>
          <div className="home-hero__side"><p>Find MCP servers that let your assistant search, create, build, play, and work with tools outside the chat.</p><Link href="/servers" className="home-text-link">Browse servers <span aria-hidden="true">↗</span></Link></div>
        </div>
      </div>
      <div className="home-wrap home-hero__art-wrap"><Link href="/journal/what-is-an-mcp-server" className="home-hero__visual" aria-label="Read the guide: Understand what is MCP"><Image src="/editorial/robot-butterfly.png" alt="A painted robot reaches toward a butterfly in a meadow" width={1536} height={1024} priority sizes="100vw" /><span className="home-hero__visual-content"><h2 className="home-hero__visual-title">Understand what is MCP</h2><span className="home-hero__visual-cta">Read the guide <span aria-hidden="true">↗</span></span></span></Link></div>
      <div className="home-wrap home-search-band"><div><h2>What should your AI be able to do?</h2><p className="home-search-hint">Search by a task, product, or type of tool.</p></div><div><SearchField large /><div className="home-search-chips"><span>Try</span><Link href="/servers?q=image+generation">Image generation</Link><Link href="/servers?q=browser">Browser automation</Link></div></div></div>
    </section>

    <section className="home-wrap home-intro" aria-label="About MCP"><p className="home-intro__label">The short version</p><div><p className="home-intro__statement">An MCP server connects an AI assistant to a tool. <span>Find the right connection for what you want to do.</span></p><Link href="/journal/what-is-an-mcp-server" className="home-text-link">How MCP works <span aria-hidden="true">↗</span></Link></div></section>

    <section className="home-wrap home-section" id="explore" aria-labelledby="doorways-title"><div className="home-section-heading"><div><h2 id="doorways-title">Explore by task.</h2></div><Link href="/explore" className="home-text-link">All categories <span aria-hidden="true">↗</span></Link></div><div className="home-doorways">{doorways.map((door) => <Link href={`/capabilities/${door.slug}`} className="home-doorway" key={door.slug}><div className="home-doorway__image"><PlateImage plate={door.plate} /></div><div className="home-doorway__body"><h3>{door.title}<span aria-hidden="true">↗</span></h3><p>{door.note}</p></div></Link>)}</div></section>

    <section className="home-feature home-feature--ink" aria-labelledby="feature-title"><div className="home-wrap home-feature__grid"><div className="home-feature__copy"><h2 id="feature-title">Not just for<br />office work.</h2><p>Control a Blender scene, make music, check the weather, or try an experiment in Minecraft. MCP can connect an assistant to focused tools as well as big platforms.</p><Link href="/servers?weird=1" className="home-round-link">Explore unusual servers <span aria-hidden="true">↗</span></Link></div><div className="home-feature__image"><Image src="/editorial/robot-workshop.png" alt="A painted robot and researcher work together in a mechanical studio" width={1536} height={1024} sizes="(min-width: 900px) 50vw, 100vw" /></div></div></section>

    <section className="home-wrap home-section" aria-labelledby="featured-title"><div className="home-section-heading"><div><h2 id="featured-title">Start here.</h2></div><Link href="/servers" className="home-text-link">Browse every server <span aria-hidden="true">↗</span></Link></div><div className="home-featured-grid">{featured.map((server) => <Link href={`/servers/${server.slug}`} className="home-server-card" key={server.slug}><div className="home-server-card__top"><ServerMark slug={server.slug} name={server.name} size="large" /></div><div><h3>{server.name}</h3><p>{server.summary}</p></div><div className="home-server-card__bottom"><span>See tools and setup</span><span aria-hidden="true">↗</span></div></Link>)}</div></section>

    <section className="home-wrap home-editorial" aria-labelledby="how-title"><div className="home-editorial__image"><PlateImage plate={plates.archive} /></div><div className="home-editorial__copy"><h2 id="how-title">Know what you&apos;re connecting.</h2><p>Each server page explains what it does, where its code lives, what it needs to run, and what access to check before installing.</p><ol><li>Find it by task or name.</li><li>Read its tools and source.</li><li>Install with the access it needs.</li></ol><Link href="/journal/read-before-you-connect" className="home-text-link">What to check first <span aria-hidden="true">↗</span></Link></div></section>

    <section className="home-wrap home-section home-recent" aria-labelledby="more-title"><div className="home-section-heading"><div><h2 id="more-title">More to explore.</h2></div><Link href="/servers" className="home-text-link">See all servers <span aria-hidden="true">↗</span></Link></div><div className="home-recent__list">{more.map((server) => <ServerSlip key={server.slug} server={server} />)}</div></section>

    <HomeJournal />

    <section className="home-wanted" aria-labelledby="wanted-title"><div className="home-wrap home-wanted__grid"><div><h2 id="wanted-title">Missing a tool?</h2><p>Request a capability you wish someone would build. Builders can find ideas here too.</p><Link href="/requests/new" className="home-round-link">Request a capability <span aria-hidden="true">↗</span></Link></div><ol>{wanted.map((request) => <li key={request.slug}><Link href={`/requests/${request.slug}`}>{request.title}<span aria-hidden="true">↗</span></Link><p>{request.wish}</p></li>)}</ol></div></section>

    <section className="home-wrap home-outro" aria-label="Explore more"><h2>Find a tool.<br />Make it useful.</h2><div><Link href="/servers" className="home-outro__button">Browse servers <span aria-hidden="true">↗</span></Link><Link href="/submit" className="home-text-link">Add a server <span aria-hidden="true">↗</span></Link></div></section>
  </div>;
}
