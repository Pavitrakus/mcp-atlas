import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { drizzle, type BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import * as schema from "@/lib/schema";

const MIGRATION = `
CREATE TABLE IF NOT EXISTS requests (
  id text PRIMARY KEY,
  number integer NOT NULL,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  wish text NOT NULL,
  service text,
  platform text,
  workflow text,
  client text,
  hosting text,
  reference text,
  author text NOT NULL,
  status text NOT NULL,
  origin text NOT NULL,
  created_at text NOT NULL
);
CREATE TABLE IF NOT EXISTS votes (
  request_id text NOT NULL,
  voter text NOT NULL,
  created_at text NOT NULL,
  PRIMARY KEY (request_id, voter)
);
CREATE TABLE IF NOT EXISTS comments (
  id text PRIMARY KEY,
  request_id text NOT NULL,
  body text NOT NULL,
  author text NOT NULL,
  created_at text NOT NULL,
  hidden integer NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS submissions (
  id text PRIMARY KEY,
  repo_url text NOT NULL,
  owner text NOT NULL,
  repo text NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  language text,
  license text,
  stars integer,
  archived integer NOT NULL DEFAULT 0,
  mcp_signal text NOT NULL,
  note text,
  status text NOT NULL,
  created_at text NOT NULL
);
`;

type DatabaseHandle = BetterSQLite3Database<typeof schema>;

const globalForDb = globalThis as unknown as { atlas?: DatabaseHandle };

export function databasePath(): string {
  if (process.env.DATABASE_PATH) return process.env.DATABASE_PATH;
  if (process.env.VERCEL) return path.join("/tmp", "atlas.db");
  return path.join(process.cwd(), "data", "atlas.db");
}

export function getDb(): DatabaseHandle {
  if (globalForDb.atlas) return globalForDb.atlas;
  const file = databasePath();
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const sqlite = new Database(file);
  sqlite.pragma("journal_mode = WAL");
  sqlite.exec(MIGRATION);
  const db = drizzle(sqlite, { schema });
  globalForDb.atlas = db;
  return db;
}
