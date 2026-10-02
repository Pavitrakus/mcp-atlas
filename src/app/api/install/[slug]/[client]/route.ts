import { NextResponse } from "next/server";
import { getServer } from "@/lib/catalog";
import { installSnippet } from "@/lib/install";
import type { ClientId } from "@/lib/types";

const CLIENTS = new Set(["cursor", "claude", "vscode", "claude-code", "generic"]);

export async function GET(_request: Request, context: { params: Promise<{ slug: string; client: string }> }) {
  const { slug, client } = await context.params;
  if (!CLIENTS.has(client)) return NextResponse.json({ error: "Unknown client." }, { status: 400 });
  const server = getServer(slug);
  if (!server) return NextResponse.json({ error: "No plate with that slug." }, { status: 404 });
  return NextResponse.json(installSnippet(server, client as ClientId));
}
