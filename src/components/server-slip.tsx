import Link from "next/link";
import { ServerMark } from "@/components/server-mark";
import type { ServerRecord } from "@/lib/types";

export function ServerSlip({ server }: { server: ServerRecord }) {
  return (
    <article className="server-slip flex items-start gap-4 border-t border-rule py-6">
        <ServerMark slug={server.slug} name={server.name} />
        <div className="min-w-0 flex-1">
        <h3 className="font-sans text-2xl font-medium leading-none tracking-[-0.055em] md:text-3xl">
          <Link href={`/servers/${server.slug}`} className="no-underline">
            {server.name}
          </Link>
        </h3>
        <p className="mt-2 max-w-xl text-ink-soft">{server.summary}</p>
        </div>
      <Link href={`/servers/${server.slug}`} className="server-slip__arrow" aria-label={`Open ${server.name}`}>↗</Link>
    </article>
  );
}
