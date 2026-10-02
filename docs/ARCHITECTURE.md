# Architecture

Next.js App Router, TypeScript, Tailwind. The catalog is a typed module in `src/data`. Search is an in-process ranker with a synonym table, so the first version does not need a separate search service. The same functions back the pages, `/api/search`, and the Atlas MCP server.

## Sources

`src/sources/officialRegistry.ts` calls `GET https://registry.modelcontextprotocol.io/v0.1/servers` with a short timeout. Results are normalized and dropped when the repository or remote URL is already a plate.

GitHub facts used for stars, license, language, push date, and archive state were read from the public REST API on 2026-10-02 and committed in `src/data/observations.ts`. The running app does not refetch them on every page view. Submission preview does call the GitHub API for one public repository the user names. It does not clone.

Glama and Smithery expose richer directories behind API keys. This edition does not call them. Their role in the ecosystem is discovery-plus-hosting. Atlas does not copy that product. It keeps a field guide and a wanted ledger.

## Mutable data

Drizzle stores requests, votes, comments, and submissions. Its synchronous SQLite adapter is backed by the local `packages/sqlite-compat` implementation, which uses Node's built-in `node:sqlite` instead of a native addon. Schema lives in `src/lib/schema.ts`. Tables are created on first open. The file path is `DATABASE_PATH` or `data/atlas.db`. Node.js 22.13 or newer is required.

SQLite is the open edition's ledger so the site runs with `npm install` and `npm run dev`, without a database daemon. The catalog itself is not rows. A later host can move the ledger to Postgres by replacing `src/lib/db.ts`. Page code should not grow a second query layer.

## MCP

`@modelcontextprotocol/server` 2.x. Tools: `search_atlas`, `get_server`, `compare_servers`, `find_capability`, `find_installation`, `search_requests`, `get_trust_report`.

- HTTP: `POST /api/mcp` using `WebStandardStreamableHTTPServerTransport` in stateless JSON mode.
- stdio: `npm run mcp`.

## Install shapes

Cursor and Claude Desktop use `mcpServers`. VS Code uses `servers` plus `type`. Claude Code gets a `claude mcp add` command for transcribed installs. Remote servers are not pretended to drop into Claude Desktop's JSON file. Cursor deep links follow the documented `cursor://anysphere.cursor-deeplink/mcp/install` form, with the config JSON base64-encoded.

## Security

Submitted repositories are untrusted. The server never runs `npm install` on them, never shells out to their commands, and never stores third-party credentials. Admin actions require `ADMIN_TOKEN`.
