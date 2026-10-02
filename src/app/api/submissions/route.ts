import { NextResponse } from "next/server";
import { previewRepository, saveSubmission } from "@/lib/ledger";
import { submissionNote } from "@/lib/validate";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const json = (await request.json().catch(() => null)) as { repoUrl?: string; note?: string; confirm?: boolean } | null;
  if (!json?.repoUrl) return NextResponse.json({ error: "A repository URL is required." }, { status: 400 });
  const preview = await previewRepository(json.repoUrl);
  if ("error" in preview) return NextResponse.json(preview, { status: 400 });
  if (!json.confirm) return NextResponse.json({ preview });
  const note = submissionNote.safeParse({ note: json.note ?? "" });
  if (!note.success) return NextResponse.json({ error: "The note is too long." }, { status: 400 });
  if (preview.existingSlug) {
    return NextResponse.json({
      error: "That repository is already a plate.",
      slug: preview.existingSlug,
      preview,
    }, { status: 409 });
  }
  const id = saveSubmission(preview, note.data.note || "");
  return NextResponse.json({ id, status: "pending", preview }, { status: 201 });
}
