import { describe, expect, it } from "vitest";
import { categories } from "@/data/categories";
import { servers } from "@/data/servers";
import { isOsiLicense } from "@/lib/catalog";
import { cursorDeepLink, installSnippet } from "@/lib/install";
import { searchServers } from "@/lib/search";
import { trustReport } from "@/lib/trust";
import { requestInput } from "@/lib/validate";
import { dedupeAgainstCatalog, normalizeRegistryItem } from "@/sources/officialRegistry";

describe("catalog", () => {
  it("prints at least fifty distinct plates", () => {
    expect(servers.length).toBeGreaterThanOrEqual(50);
    expect(new Set(servers.map((server) => server.slug)).size).toBe(servers.length);
  });

  it("only uses families that exist", () => {
    const known = new Set(categories.map((category) => category.slug));
    for (const server of servers) {
      expect(server.categories.length).toBeGreaterThan(0);
      for (const category of server.categories) expect(known.has(category)).toBe(true);
      for (const related of server.related) {
        expect(servers.some((item) => item.slug === related)).toBe(true);
      }
    }
  });
});

describe("search", () => {
  it("finds a browser server from a wish", () => {
    const found = searchServers("I want my AI to control a browser");
    expect(found.confident).toBe(true);
    expect(found.servers[0]?.slug).toBe("playwright");
  });

  it("finds postgres from a database wish", () => {
    const found = searchServers("query my database");
    expect(found.servers.some((server) => server.slug === "postgres" || server.slug === "postgres-reference")).toBe(true);
    const named = searchServers("I need something that lets me query PostgreSQL");
    expect(named.confident).toBe(true);
    expect(named.servers.some((server) => server.slug.startsWith("postgres"))).toBe(true);
  });

  it("does not invent a hinge server", () => {
    const found = searchServers("I want an MCP that lets Claude manage my Hinge conversations");
    expect(found.confident).toBe(false);
    expect(found.servers.some((server) => server.slug.includes("hinge"))).toBe(false);
  });
});

describe("install", () => {
  it("writes Cursor and VS Code shapes differently", () => {
    const server = servers.find((item) => item.slug === "filesystem");
    expect(server).toBeTruthy();
    const cursor = installSnippet(server!, "cursor");
    const vscode = installSnippet(server!, "vscode");
    expect(cursor.body).toContain('"mcpServers"');
    expect(vscode.body).toContain('"servers"');
    expect(vscode.body).toContain('"type": "stdio"');
    const parsed = JSON.parse(cursor.body) as { mcpServers: { filesystem: { command: string } } };
    expect(parsed.mcpServers.filesystem.command).toBe("npx");
  });

  it("encodes a Cursor install link as base64 JSON", () => {
    const link = cursorDeepLink("filesystem", { command: "npx", args: ["-y", "example"] });
    const config = new URL(link).searchParams.get("config");
    expect(config).toBeTruthy();
    const json = JSON.parse(Buffer.from(config!, "base64").toString("utf8")) as { command: string };
    expect(json.command).toBe("npx");
  });
});

describe("trust", () => {
  it("does not treat a missing SPDX id as an open-source license", () => {
    const filesystem = servers.find((server) => server.slug === "filesystem");
    expect(filesystem).toBeTruthy();
    expect(isOsiLicense("NOASSERTION")).toBe(false);
    const report = trustReport(filesystem!);
    expect(report.lines.some((line) => line.label === "License" && line.value.includes("NOASSERTION"))).toBe(true);
    expect(report.lines.some((line) => /this server is safe|marked safe/i.test(line.value))).toBe(false);
  });
});

describe("registry dedupe", () => {
  it("drops a hit that repeats a printed remote", () => {
    const hit = normalizeRegistryItem({
      server: {
        name: "com.notion/mcp",
        title: "Notion",
        description: "Official",
        remotes: [{ type: "streamable-http", url: "https://mcp.notion.com/mcp" }],
      },
    });
    expect(hit).toBeTruthy();
    expect(dedupeAgainstCatalog([hit!])).toHaveLength(0);
  });
});

describe("requests", () => {
  it("rejects a wish that is too short to be useful", () => {
    expect(requestInput.safeParse({ title: "Hi", wish: "short" }).success).toBe(false);
  });
});
