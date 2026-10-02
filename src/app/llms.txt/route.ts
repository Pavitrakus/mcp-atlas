import { servers } from "@/data/servers";

export function GET() {
  const base = process.env.ATLAS_PUBLIC_URL ?? "http://127.0.0.1:43123";
  const lines = ["# Atlas MCP directory", "", "Atlas is a directory of MCP servers. Each detail page contains purpose, tools, setup, permissions, and source links.", "", `Human site: ${base}/`, `Agent view: ${base}/for-bots`, `MCP explanation: ${base}/journal/what-is-an-mcp-server`, "", "## Servers", "", ...servers.map((server) => `- [${server.name}](${base}/servers/${server.slug}): ${server.summary}`)];
  return new Response(lines.join("\n"), { headers: { "content-type": "text/plain; charset=utf-8" } });
}
