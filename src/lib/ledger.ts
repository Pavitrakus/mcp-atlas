import { randomUUID } from "node:crypto";
import { and, asc, desc, eq, sql } from "drizzle-orm";
import { wantedSeeds } from "@/data/wanted";
import { getDb } from "@/lib/db";
import { comments, requests, submissions, votes } from "@/lib/schema";
import { servers } from "@/data/servers";
import { searchServers } from "@/lib/search";

export type RequestView = {
  id: string;
  number: number;
  slug: string;
  title: string;
  wish: string;
  service: string | null;
  platform: string | null;
  workflow: string | null;
  client: string | null;
  hosting: string | null;
  reference: string | null;
  author: string;
  status: string;
  origin: string;
  createdAt: string;
  votes: number;
};

function rowToView(row: typeof requests.$inferSelect, voteCount: number): RequestView {
  return {
    id: row.id,
    number: row.number,
    slug: row.slug,
    title: row.title,
    wish: row.wish,
    service: row.service,
    platform: row.platform,
    workflow: row.workflow,
    client: row.client,
    hosting: row.hosting,
    reference: row.reference,
    author: row.author,
    status: row.status,
    origin: row.origin,
    createdAt: row.createdAt,
    votes: voteCount,
  };
}

export function ensureLedger(): void {
  const db = getDb();
  const existing = db.select({ id: requests.id }).from(requests).all();
  if (existing.length > 0) return;
  const now = new Date().toISOString();
  for (const [index, seed] of wantedSeeds.entries()) {
    db.insert(requests)
      .values({
        id: randomUUID(),
        number: index + 1,
        slug: seed.slug,
        title: seed.title,
        wish: seed.wish,
        service: seed.service ?? null,
        platform: seed.platform ?? null,
        workflow: seed.workflow ?? null,
        client: null,
        hosting: seed.hosting ?? null,
        reference: null,
        author: "This edition",
        status: "open",
        origin: "edition",
        createdAt: now,
      })
      .run();
  }
}

export function listAllRequests(): RequestView[] {
  ensureLedger();
  const db = getDb();
  return db
    .select()
    .from(requests)
    .orderBy(desc(requests.number))
    .all()
    .map((row) => rowToView(row, voteCount(row.id)));
}

export function setRequestStatus(id: string, status: "open" | "hidden") {
  const db = getDb();
  db.update(requests).set({ status }).where(eq(requests.id, id)).run();
}

export function listRequests(): RequestView[] {
  ensureLedger();
  const db = getDb();
  const rows = db.select().from(requests).where(eq(requests.status, "open")).orderBy(desc(requests.number)).all();
  return rows
    .map((row) => rowToView(row, voteCount(row.id)))
    .sort((a, b) => b.votes - a.votes || a.number - b.number);
}

export function getRequest(slug: string): RequestView | undefined {
  ensureLedger();
  const db = getDb();
  const row = db.select().from(requests).where(eq(requests.slug, slug)).get();
  if (!row || row.status === "hidden") return undefined;
  return rowToView(row, voteCount(row.id));
}

function voteCount(requestId: string): number {
  const db = getDb();
  const row = db
    .select({ count: sql<number>`count(*)` })
    .from(votes)
    .where(eq(votes.requestId, requestId))
    .get();
  return Number(row?.count ?? 0);
}

export function castVote(slug: string, voter: string): { ok: boolean; votes: number; already: boolean } {
  const request = getRequest(slug);
  if (!request) return { ok: false, votes: 0, already: false };
  const db = getDb();
  const existing = db
    .select()
    .from(votes)
    .where(and(eq(votes.requestId, request.id), eq(votes.voter, voter)))
    .get();
  if (existing) return { ok: true, votes: request.votes, already: true };
  db.insert(votes)
    .values({ requestId: request.id, voter, createdAt: new Date().toISOString() })
    .run();
  return { ok: true, votes: request.votes + 1, already: false };
}

export function listComments(slug: string) {
  const request = getRequest(slug);
  if (!request) return [];
  const db = getDb();
  return db
    .select()
    .from(comments)
    .where(and(eq(comments.requestId, request.id), eq(comments.hidden, 0)))
    .orderBy(asc(comments.createdAt))
    .all();
}

export function addComment(slug: string, body: string, author: string) {
  const request = getRequest(slug);
  if (!request) return null;
  const db = getDb();
  const id = randomUUID();
  db.insert(comments)
    .values({
      id,
      requestId: request.id,
      body,
      author: author.trim() || "Anonymous reader",
      createdAt: new Date().toISOString(),
      hidden: 0,
    })
    .run();
  return id;
}

export function slugify(input: string): string {
  const base = input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
  return base || "request";
}

export function createRequest(input: {
  title: string;
  wish: string;
  service?: string;
  platform?: string;
  workflow?: string;
  client?: string;
  hosting?: string;
  reference?: string;
  author?: string;
}): RequestView {
  ensureLedger();
  const db = getDb();
  const max = db.select({ value: sql<number>`coalesce(max(number), 0)` }).from(requests).get();
  const number = Number(max?.value ?? 0) + 1;
  let slug = slugify(input.title);
  const clash = db.select().from(requests).where(eq(requests.slug, slug)).get();
  if (clash) slug = `${slug}-${number}`;
  const id = randomUUID();
  const createdAt = new Date().toISOString();
  db.insert(requests)
    .values({
      id,
      number,
      slug,
      title: input.title,
      wish: input.wish,
      service: input.service || null,
      platform: input.platform || null,
      workflow: input.workflow || null,
      client: input.client || null,
      hosting: input.hosting || null,
      reference: input.reference || null,
      author: input.author?.trim() || "Anonymous reader",
      status: "open",
      origin: "reader",
      createdAt,
    })
    .run();
  return rowToView(
    {
      id,
      number,
      slug,
      title: input.title,
      wish: input.wish,
      service: input.service || null,
      platform: input.platform || null,
      workflow: input.workflow || null,
      client: input.client || null,
      hosting: input.hosting || null,
      reference: input.reference || null,
      author: input.author?.trim() || "Anonymous reader",
      status: "open",
      origin: "reader",
      createdAt,
    },
    0,
  );
}

export function closeMatches(wish: string) {
  const found = searchServers(wish);
  return found.servers.slice(0, 4);
}

export function knownServerForRepo(owner: string, repo: string) {
  const full = `${owner}/${repo}`.toLowerCase();
  return servers.find((server) => server.repository?.toLowerCase() === full);
}

export type SubmissionPreview = {
  repoUrl: string;
  owner: string;
  repo: string;
  name: string;
  description: string;
  language: string | null;
  license: string | null;
  stars: number | null;
  archived: boolean;
  mcpSignal: "confirmed" | "unconfirmed";
  topics: string[];
  existingSlug?: string;
};

const MCP_WORDS = ["mcp", "modelcontextprotocol", "model-context-protocol", "model context protocol"];

export function parseGithubRepo(url: string): { owner: string; repo: string } | null {
  let parsed: URL;
  try {
    parsed = new URL(url.trim());
  } catch {
    return null;
  }
  if (parsed.protocol !== "https:" || parsed.hostname !== "github.com") return null;
  const parts = parsed.pathname.split("/").filter(Boolean);
  if (parts.length < 2) return null;
  const owner = parts[0]!;
  const repo = parts[1]!.replace(/\.git$/, "");
  if (!/^[\w.-]+$/.test(owner) || !/^[\w.-]+$/.test(repo)) return null;
  return { owner, repo };
}

export async function previewRepository(url: string): Promise<SubmissionPreview | { error: string }> {
  const parsed = parseGithubRepo(url);
  if (!parsed) return { error: "Use a https://github.com/owner/repo URL. Other hosts are not fetched." };
  const endpoint = `https://api.github.com/repos/${parsed.owner}/${parsed.repo}`;
  const response = await fetch(endpoint, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "mcp-atlas",
    },
    cache: "no-store",
  });
  if (response.status === 404) return { error: "GitHub has no public repository at that URL." };
  if (!response.ok) return { error: `GitHub returned ${response.status}. Nothing was stored.` };
  const data = (await response.json()) as {
    name?: string;
    full_name?: string;
    description?: string | null;
    language?: string | null;
    stargazers_count?: number;
    archived?: boolean;
    topics?: string[];
    license?: { spdx_id?: string | null } | null;
    html_url?: string;
  };
  const topics = data.topics ?? [];
  const blob = `${data.name ?? ""} ${data.description ?? ""} ${topics.join(" ")}`.toLowerCase();
  const mcpSignal = MCP_WORDS.some((word) => blob.includes(word)) ? "confirmed" : "unconfirmed";
  const existing = knownServerForRepo(parsed.owner, parsed.repo);
  return {
    repoUrl: data.html_url ?? `https://github.com/${parsed.owner}/${parsed.repo}`,
    owner: parsed.owner,
    repo: parsed.repo,
    name: data.name ?? parsed.repo,
    description: data.description ?? "",
    language: data.language ?? null,
    license: data.license?.spdx_id ?? null,
    stars: data.stargazers_count ?? null,
    archived: Boolean(data.archived),
    mcpSignal,
    topics,
    existingSlug: existing?.slug,
  };
}

export function saveSubmission(preview: SubmissionPreview, note: string) {
  const db = getDb();
  const id = randomUUID();
  db.insert(submissions)
    .values({
      id,
      repoUrl: preview.repoUrl,
      owner: preview.owner,
      repo: preview.repo,
      name: preview.name,
      description: preview.description,
      language: preview.language,
      license: preview.license,
      stars: preview.stars,
      archived: preview.archived ? 1 : 0,
      mcpSignal: preview.mcpSignal,
      note: note || null,
      status: "pending",
      createdAt: new Date().toISOString(),
    })
    .run();
  return id;
}

export function listSubmissions(status?: string) {
  const db = getDb();
  const rows = db.select().from(submissions).orderBy(desc(submissions.createdAt)).all();
  return status ? rows.filter((row) => row.status === status) : rows;
}

export function setSubmissionStatus(id: string, status: "pending" | "approved" | "rejected") {
  const db = getDb();
  db.update(submissions).set({ status }).where(eq(submissions.id, id)).run();
}

export function approvedSubmissions() {
  return listSubmissions("approved");
}
