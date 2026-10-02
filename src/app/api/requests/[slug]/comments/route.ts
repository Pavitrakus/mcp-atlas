import { NextResponse } from "next/server";
import { addComment } from "@/lib/ledger";
import { commentInput } from "@/lib/validate";

export const dynamic = "force-dynamic";

export async function POST(request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const json = await request.json().catch(() => null);
  const parsed = commentInput.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Write a short note." }, { status: 400 });
  const id = addComment(slug, parsed.data.body, parsed.data.author || "");
  if (!id) return NextResponse.json({ error: "No such request." }, { status: 404 });
  return NextResponse.json({ id }, { status: 201 });
}
