import { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import { getServer, relatedServers } from "@/lib/catalog";
import { installSnippet } from "@/lib/install";
import { listRequests } from "@/lib/ledger";
import { searchServers, suggestStack } from "@/lib/search";
import { trustReport } from "@/lib/trust";
import type { ClientId } from "@/lib/types";

const clientSchema = z.enum(["cursor", "claude", "vscode", "claude-code", "generic"]);

function text(value: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }],
  };
}

export function createAtlasServer() {
  const server = new McpServer({ name: "atlas", version: "0.1.0" });

  server.registerTool(
    "search_atlas",
    {
      title: "Search Atlas",
      description: "Search the Atlas edition for MCP servers by the ability you want, not only by product name.",
      inputSchema: z.object({
        query: z.string().describe("Natural language, for example: query my database"),
        category: z.string().optional(),
        client: clientSchema.optional(),
        language: z.string().optional(),
        license: z.string().optional(),
        transport: z.enum(["stdio", "sse", "streamable-http"]).optional(),
        openSourceOnly: z.boolean().optional(),
      }),
    },
    async ({ query, category, language, license, transport }) => {
      const found = searchServers(query, { category, language, license, transport });
      return text({
        confident: found.confident,
        stack: suggestStack(query),
        servers: found.servers.slice(0, 12).map(brief),
      });
    },
  );

  server.registerTool(
    "get_server",
    {
      title: "Get server",
      description: "Return one Atlas server plate by slug.",
      inputSchema: z.object({ serverId: z.string() }),
    },
    async ({ serverId }) => {
      const found = getServer(serverId);
      if (!found) return text({ error: "No plate with that slug in this edition." });
      return text(found);
    },
  );

  server.registerTool(
    "compare_servers",
    {
      title: "Compare servers",
      description: "Compare up to four servers already in the Atlas.",
      inputSchema: z.object({ serverIds: z.array(z.string()).min(2).max(4) }),
    },
    async ({ serverIds }) => {
      const rows = serverIds.map((id) => {
        const found = getServer(id);
        if (!found) return { serverId: id, error: "missing" };
        return {
          slug: found.slug,
          name: found.name,
          summary: found.summary,
          hosting: found.hosting,
          auth: found.auth,
          transports: found.transports,
          warnings: found.warnings,
          trust: trustReport(found).lines,
        };
      });
      return text({ rows });
    },
  );

  server.registerTool(
    "find_capability",
    {
      title: "Find capability",
      description: "Turn a wish into matching servers and, when useful, a stack of families.",
      inputSchema: z.object({ naturalLanguageRequest: z.string() }),
    },
    async ({ naturalLanguageRequest }) => {
      const found = searchServers(naturalLanguageRequest);
      const stack = suggestStack(naturalLanguageRequest);
      return text({
        explanation: found.confident
          ? "The edition has plates that match this wish. Read the cautions before you install."
          : "Nothing convincing is printed for this wish. It belongs on the wanted ledger.",
        stack,
        servers: found.servers.slice(0, 8).map(brief),
      });
    },
  );

  server.registerTool(
    "find_installation",
    {
      title: "Find installation",
      description: "Client-specific install text for one server.",
      inputSchema: z.object({
        serverId: z.string(),
        client: clientSchema,
      }),
    },
    async ({ serverId, client }) => {
      const found = getServer(serverId);
      if (!found) return text({ error: "No plate with that slug." });
      return text(installSnippet(found, client as ClientId));
    },
  );

  server.registerTool(
    "search_requests",
    {
      title: "Search wanted ledger",
      description: "Search capabilities people have asked for.",
      inputSchema: z.object({ query: z.string() }),
    },
    async ({ query }) => {
      const needle = query.toLowerCase();
      const rows = listRequests().filter((request) =>
        `${request.title} ${request.wish} ${request.service ?? ""}`.toLowerCase().includes(needle),
      );
      return text({ requests: rows.slice(0, 12) });
    },
  );

  server.registerTool(
    "get_trust_report",
    {
      title: "Trust report",
      description: "Evidence recorded for one server. Not a safety score.",
      inputSchema: z.object({ serverId: z.string() }),
    },
    async ({ serverId }) => {
      const found = getServer(serverId);
      if (!found) return text({ error: "No plate with that slug." });
      return text({
        slug: found.slug,
        ...trustReport(found),
        related: relatedServers(found).map((item) => item.slug),
      });
    },
  );

  return server;
}

function brief(server: ReturnType<typeof getServer>) {
  if (!server) return null;
  return {
    slug: server.slug,
    name: server.name,
    summary: server.summary,
    categories: server.categories,
    hosting: server.hosting,
    authRequired: server.auth.required,
    transports: server.transports,
    warnings: server.warnings,
  };
}
