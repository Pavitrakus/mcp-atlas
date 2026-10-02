import { NextResponse } from "next/server";
import { getServer, observationFor, plateNumber, relatedServers } from "@/lib/catalog";
import { trustReport } from "@/lib/trust";

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const server = getServer(slug);
  if (!server) return NextResponse.json({ error: "No plate with that slug." }, { status: 404 });
  return NextResponse.json({
    plate: plateNumber(server),
    server,
    observation: observationFor(server) ?? null,
    trust: trustReport(server),
    related: relatedServers(server).map((item) => ({ slug: item.slug, name: item.name, summary: item.summary })),
  });
}
