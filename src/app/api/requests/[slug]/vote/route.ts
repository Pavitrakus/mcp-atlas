import { NextResponse } from "next/server";
import { castVote } from "@/lib/ledger";

export const dynamic = "force-dynamic";

export async function POST(request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const voter = await voterId(request);
  const result = castVote(slug, voter);
  if (!result.ok) return NextResponse.json({ error: "No such request." }, { status: 404 });
  const response = NextResponse.json(result);
  response.cookies.set("atlas_voter", voter, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 400 });
  return response;
}

async function voterId(request: Request): Promise<string> {
  const header = request.headers.get("cookie") ?? "";
  const match = header.match(/(?:^|;\s*)atlas_voter=([^;]+)/);
  if (match?.[1]) return decodeURIComponent(match[1]);
  return crypto.randomUUID();
}
