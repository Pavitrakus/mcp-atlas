import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { listAllRequests, listSubmissions, setRequestStatus, setSubmissionStatus } from "@/lib/ledger";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const expected = process.env.ADMIN_TOKEN;
  const jar = await cookies();
  const unlocked = Boolean(expected) && jar.get("atlas_admin")?.value === digest(expected ?? "");
  const pending = unlocked ? listSubmissions("pending") : [];
  const requests = unlocked ? listAllRequests() : [];

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 md:px-8">
      <p className="kicker">Editor</p>
      <h1 className="display mt-3 text-6xl">The desk</h1>
      {!expected ? (
        <p className="mt-4">Set ADMIN_TOKEN in the environment to open the desk. Browsing the atlas does not require it.</p>
      ) : null}
      {expected && !unlocked ? (
        <form action={unlock} className="mt-6 space-y-3">
          <label className="block">
            <span className="kicker">Token</span>
            <input name="token" type="password" className="mt-2 w-full border border-ink bg-verso px-3 py-3 outline-none" />
          </label>
          <button type="submit" className="border border-ink px-4 py-3 kicker">
            Unlock
          </button>
        </form>
      ) : null}
      {unlocked ? (
        <>
          <h2 className="mt-10 font-display text-3xl">Pending submissions</h2>
          {pending.length === 0 ? <p className="mt-2 text-dust">None waiting.</p> : null}
          <ul>
            {pending.map((item) => (
              <li key={item.id} className="border-t border-rule py-4">
                <p className="font-display text-2xl">{item.name}</p>
                <p className="text-sm">{item.description}</p>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-dust">
                  {item.mcpSignal} · {item.license ?? "no license"} · {item.repoUrl}
                </p>
                <form action={moderate} className="mt-3 flex gap-3">
                  <input type="hidden" name="id" value={item.id} />
                  <button name="status" value="approved" className="kicker text-oxblood">
                    Approve
                  </button>
                  <button name="status" value="rejected" className="kicker">
                    Reject
                  </button>
                </form>
              </li>
            ))}
          </ul>
          <h2 className="mt-10 font-display text-3xl">Requests</h2>
          <ul>
            {requests.map((request) => (
              <li key={request.id} className="flex items-baseline justify-between gap-4 border-t border-rule py-3">
                <span>
                  {request.title} <span className="text-dust">({request.status})</span>
                </span>
                <form action={hideRequest}>
                  <input type="hidden" name="id" value={request.id} />
                  <button className="kicker" name="status" value={request.status === "hidden" ? "open" : "hidden"}>
                    {request.status === "hidden" ? "Restore" : "Hide"}
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}

async function unlock(formData: FormData) {
  "use server";
  const expected = process.env.ADMIN_TOKEN;
  const given = String(formData.get("token") ?? "");
  if (!expected || !safeEqual(given, expected)) return;
  const jar = await cookies();
  jar.set("atlas_admin", digest(expected), { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 12 });
  redirect("/admin");
}

async function moderate(formData: FormData) {
  "use server";
  if (!(await isAdmin())) return;
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (status === "approved" || status === "rejected" || status === "pending") {
    setSubmissionStatus(id, status);
  }
  redirect("/admin");
}

async function hideRequest(formData: FormData) {
  "use server";
  if (!(await isAdmin())) return;
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (status === "hidden" || status === "open") setRequestStatus(id, status);
  redirect("/admin");
}

async function isAdmin(): Promise<boolean> {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) return false;
  const jar = await cookies();
  return jar.get("atlas_admin")?.value === digest(expected);
}

function digest(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function safeEqual(left: string, right: string): boolean {
  const a = Buffer.from(digest(left));
  const b = Buffer.from(digest(right));
  return a.length === b.length && timingSafeEqual(a, b);
}
