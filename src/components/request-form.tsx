"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function RequestForm({ initialWish = "", initialTitle = "" }: { initialWish?: string; initialTitle?: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(formData: FormData) {
    setPending(true);
    setError("");
    const payload = {
      title: String(formData.get("title") ?? ""),
      wish: String(formData.get("wish") ?? ""),
      service: String(formData.get("service") ?? ""),
      platform: String(formData.get("platform") ?? ""),
      workflow: String(formData.get("workflow") ?? ""),
      client: String(formData.get("client") ?? ""),
      hosting: String(formData.get("hosting") ?? ""),
      reference: String(formData.get("reference") ?? ""),
      author: String(formData.get("author") ?? ""),
    };
    const response = await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = (await response.json()) as { error?: string; request?: { slug: string } };
    setPending(false);
    if (!response.ok || !body.request) {
      setError(body.error ?? "The ledger refused the note.");
      return;
    }
    router.push(`/requests/${body.request.slug}`);
  }

  return (
    <form action={onSubmit} className="space-y-5">
      <Field label="Title" name="title" defaultValue={initialTitle} required placeholder="Arduino serial" />
      <label className="block">
        <span className="kicker">I want</span>
        <textarea
          name="wish"
          required
          defaultValue={initialWish}
          rows={5}
          className="mt-2 w-full border border-ink bg-verso px-3 py-3 font-display text-2xl outline-none"
          placeholder="I want an assistant to…"
        />
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Service, optional" name="service" placeholder="Hinge, QGIS, a local printer" />
        <Field label="Platform, optional" name="platform" placeholder="macOS, a Raspberry Pi" />
        <Field label="Preferred client, optional" name="client" placeholder="Cursor" />
        <label className="block">
          <span className="kicker">Where it should run</span>
          <select name="hosting" className="mt-2 w-full border border-ink bg-verso px-3 py-3" defaultValue="">
            <option value="">Unspecified</option>
            <option value="local">On my machine</option>
            <option value="remote">Hosted</option>
            <option value="either">Either</option>
          </select>
        </label>
      </div>
      <label className="block">
        <span className="kicker">Example workflow, optional</span>
        <textarea name="workflow" rows={3} className="mt-2 w-full border border-rule bg-verso px-3 py-3 outline-none" />
      </label>
      <Field label="Reference link, optional" name="reference" placeholder="https://" />
      <Field label="Name, optional" name="author" placeholder="Anonymous reader" />
      {error ? <p className="text-oxblood">{error}</p> : null}
      <button type="submit" disabled={pending} className="border border-ink bg-ink px-4 py-3 kicker text-paper disabled:opacity-60">
        {pending ? "Publishing" : "Publish request"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  placeholder,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="kicker">{label}</span>
      <input
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className="mt-2 w-full border border-ink bg-verso px-3 py-3 outline-none"
      />
    </label>
  );
}
