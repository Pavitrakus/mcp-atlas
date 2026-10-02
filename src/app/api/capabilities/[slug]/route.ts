import { NextResponse } from "next/server";
import { categoryBySlug } from "@/data/categories";
import { serversInCategory } from "@/lib/catalog";

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const category = categoryBySlug.get(slug);
  if (!category) return NextResponse.json({ error: "No such family." }, { status: 404 });
  const list = serversInCategory(slug);
  return NextResponse.json({
    category,
    count: list.length,
    servers: list.map((server) => ({ slug: server.slug, name: server.name, summary: server.summary })),
  });
}
