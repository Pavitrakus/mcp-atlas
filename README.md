# Atlas

A field guide to what an assistant can do. Atlas catalogs open MCP servers by capability, shows the evidence around each one, writes an install snippet for Cursor, Claude, VS Code, and Claude Code, and keeps a ledger of abilities that do not exist yet.

## Run

Requires Node.js 22.13 or newer. The local SQLite ledger uses Node's built-in `node:sqlite` through the small compatibility layer in `packages/sqlite-compat`, so no native C++ toolchain is needed.

```bash
npm install
npm run dev
```

The dev server in this environment is started on port 43123:

```bash
npm run dev -- --hostname 0.0.0.0 --port 43123
```

Copy `.env.example` to `.env.local` if you want a public URL for metadata or an admin token.

The wanted ledger is a SQLite file at `data/atlas.db` (or `DATABASE_PATH`). It is created on first use. Browsing does not require an account.

## Tests

```bash
npm test
npm run lint
```

## Atlas MCP

The site is itself an MCP server.

Streamable HTTP, stateless JSON responses:

```json
{
  "mcpServers": {
    "atlas": {
      "url": "http://127.0.0.1:43123/api/mcp"
    }
  }
}
```

Or stdio from a checkout:

```bash
npm run mcp
```

Tools: `search_atlas`, `get_server`, `compare_servers`, `find_capability`, `find_installation`, `search_requests`, `get_trust_report`.

## Data

Plates in `src/data/servers.ts` are a curated edition. GitHub stars, licenses, languages, and push dates in `src/data/observations.ts` were read from the public GitHub API on 2026-10-02. They are repository facts, not install counts.

Search can also ask the official registry (`registry.modelcontextprotocol.io`) and shows those hits in a separate list. npm package versions printed on a plate were observed the same day.

The landing page has original editorial artwork in `public/editorial`, and selected publisher marks are cached locally in `public/brands`. The Field notes in `src/data/journal.ts` give the directory a readable introduction without changing the plate data.

Glama and Smithery are not called. Their APIs need keys, and this edition is a field guide rather than another hosted directory.

## Editor desk

Set `ADMIN_TOKEN` and open `/admin` to approve or reject submissions and hide request spam. Without the token, the desk stays locked.

## Documents

- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/DESIGN.md`
