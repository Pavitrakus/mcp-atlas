import type { Metadata } from "next";
import Link from "next/link";
import { servers } from "@/data/servers";

export const metadata: Metadata = { title: "For bots", description: "Plain text guide and structured links to MCP servers in Atlas." };

export default function ForBotsPage() {
  return <article className="bot-page home-wrap"><header><p>Atlas / machine-readable view</p><h1>MCP server directory for agents</h1><p>This page is intentionally text-only. Each entry links to a detail page with a summary, tools, setup information, permissions, source links, and related servers.</p><nav aria-label="Bot navigation"><a href="#servers">Servers</a><Link href="/journal/what-is-an-mcp-server">What is MCP?</Link><Link href="/servers">Human catalog</Link><a href="/llms.txt">llms.txt</a></nav></header><section id="servers"><h2>Servers</h2><ul>{servers.map((server) => <li key={server.slug}><h3><Link href={`/servers/${server.slug}`}>{server.name}</Link></h3><p>{server.summary}</p><p>Categories: {server.categories.join(", ")}. Hosting: {server.hosting}. API key: {server.auth.required ? "required" : "not required"}.</p><p>Source: {server.repository ? <a href={`https://github.com/${server.repository}`}>github.com/{server.repository}</a> : server.homepage ? <a href={server.homepage}>{server.homepage}</a> : "See detail page"}</p></li>)}</ul></section></article>;
}
