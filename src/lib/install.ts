import type { ClientId, InstallRecord, ServerRecord } from "@/lib/types";

export const CLIENTS: { id: ClientId; label: string; file: string }[] = [
  { id: "cursor", label: "Cursor", file: "~/.cursor/mcp.json or .cursor/mcp.json" },
  { id: "claude", label: "Claude", file: "claude_desktop_config.json" },
  { id: "vscode", label: "VS Code", file: ".vscode/mcp.json" },
  { id: "claude-code", label: "Claude Code", file: ".mcp.json" },
  { id: "generic", label: "Generic", file: "client configuration" },
];

export type InstallSnippet = {
  client: ClientId;
  title: string;
  body: string;
  note: string;
  cursorLink?: string;
};

function serverConfig(server: ServerRecord): Record<string, unknown> | null {
  const install = server.install;
  if (install.kind === "npm") {
    const env: Record<string, string> = {};
    for (const variable of install.env) env[variable.key] = `\${${variable.key}}`;
    const config: Record<string, unknown> = {
      command: "npx",
      args: install.args,
    };
    if (Object.keys(env).length > 0) config.env = env;
    return config;
  }
  if (install.kind === "remote") {
    const config: Record<string, unknown> = { url: install.url };
    if (install.headers.length > 0) {
      const headers: Record<string, string> = {};
      for (const header of install.headers) headers[header.key] = `\${${header.key}}`;
      config.headers = headers;
    }
    return config;
  }
  return null;
}

export function installSnippet(server: ServerRecord, client: ClientId): InstallSnippet {
  const config = serverConfig(server);
  if (!config) {
    return {
      client,
      title: "Read the repository",
      body: readmeNote(server.install),
      note: "This edition only prints a command it has checked. The JSON shape below is a blank you fill from the README.",
    };
  }

  if (client === "vscode") {
    const vscodeConfig = { ...config };
    if ("url" in config) vscodeConfig.type = "http";
    else vscodeConfig.type = "stdio";
    return {
      client,
      title: "VS Code",
      body: json({ servers: { [server.slug]: vscodeConfig } }),
      note: "VS Code uses a top-level servers key and an explicit type. Workspace file: .vscode/mcp.json. Restart the agent host after saving.",
    };
  }

  if (client === "claude-code") {
    if ("url" in config) {
      return {
        client,
        title: "Claude Code",
        body: `claude mcp add --transport http ${server.slug} ${String(config.url)}`,
        note: "Project servers live in .mcp.json and can be committed. Run claude mcp list afterwards.",
      };
    }
    const args = (config.args as string[]).map(shellEscape).join(" ");
    return {
      client,
      title: "Claude Code",
      body: `claude mcp add ${server.slug} -- npx ${args}`,
      note: "The double dash separates Claude's flags from the server command. Add env vars in .mcp.json if the server needs them.",
    };
  }

  if (client === "claude") {
    if ("url" in config) {
      return {
        client,
        title: "Claude Desktop",
        body: "Claude Desktop's JSON file is documented for local stdio servers.\nAdd official remote servers through Settings → Connectors when the publisher is listed there.\nA url key in claude_desktop_config.json is not the documented desktop path.",
        note: "macOS: ~/Library/Application Support/Claude/claude_desktop_config.json. Windows: %APPDATA%\\Claude\\claude_desktop_config.json. Quit the app fully after a local edit.",
      };
    }
    return {
      client,
      title: "Claude Desktop",
      body: json({ mcpServers: { [server.slug]: config } }),
      note: "Put this in claude_desktop_config.json, then quit Claude Desktop completely and reopen it.",
      cursorLink: undefined,
    };
  }

  if (client === "cursor") {
    const snippet = json({ mcpServers: { [server.slug]: config } });
    return {
      client,
      title: "Cursor",
      body: snippet,
      note: "Global file: ~/.cursor/mcp.json. Project file: .cursor/mcp.json. The button opens Cursor's install prompt on a computer where Cursor is installed. It does not install anything by itself.",
      cursorLink: cursorDeepLink(server.slug, config),
    };
  }

  return {
    client,
    title: "Generic MCP",
    body: [
      "Cursor and Claude Desktop use mcpServers:",
      json({ mcpServers: { [server.slug]: config } }),
      "",
      "VS Code uses servers and a type field:",
      json({
        servers: {
          [server.slug]: { ...config, type: "url" in config ? "http" : "stdio" },
        },
      }),
    ].join("\n"),
    note: "Transports in this edition: stdio for a local process, streamable HTTP for a remote URL. SSE is older. Prefer the publisher's current transport.",
  };
}

function readmeNote(install: InstallRecord): string {
  if (install.kind === "readme") return install.note;
  return "No transcribed command.";
}

function json(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

function shellEscape(value: string): string {
  if (/^[A-Za-z0-9@._+:/=-]+$/.test(value)) return value;
  return `'${value.replace(/'/g, `'\\''`)}'`;
}

export function cursorDeepLink(name: string, config: Record<string, unknown>): string {
  const encoded = encodeURIComponent(encodeBase64(JSON.stringify(config)));
  return `cursor://anysphere.cursor-deeplink/mcp/install?name=${encodeURIComponent(name)}&config=${encoded}`;
}

function encodeBase64(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

export function installPlain(server: ServerRecord): string {
  const install = server.install;
  if (install.kind === "npm") {
    const env = install.env.map((item) => `${item.key}=…`).join(" ");
    return [`npx ${install.args.join(" ")}`, env].filter(Boolean).join("\n");
  }
  if (install.kind === "remote") return install.url;
  return install.note;
}
