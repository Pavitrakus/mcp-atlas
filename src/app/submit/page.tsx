import type { Metadata } from "next";
import { SubmitForm } from "@/components/submit-form";

export const metadata: Metadata = {
  title: "Submit",
  description: "Offer a public GitHub repository. The Atlas reads metadata and does not run the code.",
};

export default function SubmitPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-10 md:px-8">
      <p className="kicker">Accession</p>
      <h1 className="display mt-3 text-6xl">Submit a server</h1>
      <p className="mt-4 text-ink-soft">
        Paste a public GitHub URL. We ask GitHub for the description, language, license, and topics. We do not clone the repo, install the package, or execute it. If the public text never mentions MCP, the submission is flagged and still waits for a person.
      </p>
      <div className="mt-8">
        <SubmitForm />
      </div>
    </div>
  );
}
