import Link from "next/link";
import { IndexDialog } from "@/components/index-dialog";
import { SearchCommand } from "@/components/search-command";
import { AudienceGate } from "@/components/audience-gate";
import { ThemeToggle } from "@/components/theme-toggle";

const links = [
  { href: "/servers", label: "Servers" },
  { href: "/explore", label: "Explore" },
  { href: "/journal", label: "Learn" },
  { href: "/servers?weird=1", label: "Unusual" },
];

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="site-header">
        <div className="site-header__inner">
          <Link href="/" className="site-brand" aria-label="Atlas home">
            <span>atlas<span className="site-brand__period">.</span></span>
          </Link>
          <nav className="site-nav" aria-label="Primary">
            {links.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="site-header__actions">
            <ThemeToggle />
            <Link href="/for-bots" className="site-bot-link">For bots</Link>
            <SearchCommand />
            <IndexDialog links={links} />
          </div>
        </div>
      </header>
      <AudienceGate />
      <main id="content">{children}</main>
      <footer className="site-footer"><div className="home-wrap site-footer__inner"><div><Link href="/" className="site-footer__brand">atlas.</Link><p>Find and understand MCP servers.</p></div><nav aria-label="Footer"><Link href="/servers">Servers</Link><Link href="/journal/what-is-an-mcp-server">What is MCP?</Link><Link href="/submit">Submit a server</Link><Link href="/for-bots">For bots</Link><Link href="/legal/privacy">Privacy</Link></nav></div><div className="site-footer__watermark" aria-hidden="true">atlas.</div></footer>
    </>
  );
}
