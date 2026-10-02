import { NextResponse } from "next/server";
import { createRequest, listRequests } from "@/lib/ledger";
import { requestInput } from "@/lib/validate";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ requests: listRequests() });
}

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = requestInput.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "The wish needs a short title and a sentence of at least a few words." }, { status: 400 });
  }
  const created = createRequest({
    title: parsed.data.title,
    wish: parsed.data.wish,
    service: parsed.data.service || undefined,
    platform: parsed.data.platform || undefined,
    workflow: parsed.data.workflow || undefined,
    client: parsed.data.client || undefined,
    hosting: parsed.data.hosting || undefined,
    reference: parsed.data.reference || undefined,
    author: parsed.data.author || undefined,
  });
  return NextResponse.json({ request: created }, { status: 201 });
}
