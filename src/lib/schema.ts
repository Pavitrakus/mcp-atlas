import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const requests = sqliteTable("requests", {
  id: text("id").primaryKey(),
  number: integer("number").notNull(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  wish: text("wish").notNull(),
  service: text("service"),
  platform: text("platform"),
  workflow: text("workflow"),
  client: text("client"),
  hosting: text("hosting"),
  reference: text("reference"),
  author: text("author").notNull(),
  status: text("status").notNull(),
  origin: text("origin").notNull(),
  createdAt: text("created_at").notNull(),
});

export const votes = sqliteTable(
  "votes",
  {
    requestId: text("request_id").notNull(),
    voter: text("voter").notNull(),
    createdAt: text("created_at").notNull(),
  },
  (table) => [primaryKey({ columns: [table.requestId, table.voter] })],
);

export const comments = sqliteTable("comments", {
  id: text("id").primaryKey(),
  requestId: text("request_id").notNull(),
  body: text("body").notNull(),
  author: text("author").notNull(),
  createdAt: text("created_at").notNull(),
  hidden: integer("hidden").notNull().default(0),
});

export const submissions = sqliteTable("submissions", {
  id: text("id").primaryKey(),
  repoUrl: text("repo_url").notNull(),
  owner: text("owner").notNull(),
  repo: text("repo").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  language: text("language"),
  license: text("license"),
  stars: integer("stars"),
  archived: integer("archived").notNull().default(0),
  mcpSignal: text("mcp_signal").notNull(),
  note: text("note"),
  status: text("status").notNull(),
  createdAt: text("created_at").notNull(),
});
