import { NextResponse } from "next/server";
import { closeMatches, getRequest, listComments } from "@/lib/ledger";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const request = getRequest(slug);
  if (!request) return NextResponse.json({ error: "No such request." }, { status: 404 });
  return NextResponse.json({
    request,
    comments: listComments(slug),
    closeMatches: closeMatches(request.wish).map((server) => ({
      slug: server.slug,
      name: server.name,
      summary: server.summary,
    })),
  });
}
