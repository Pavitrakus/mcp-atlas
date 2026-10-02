import type { ServerRecord } from "@/lib/types";

export function ToolList({ server }: { server: ServerRecord }) {
  return (
    <section aria-labelledby="tools-heading">
      <h2 id="tools-heading" className="font-display text-4xl">
        Tools
      </h2>
      {server.toolsNote ? <p className="mt-3 max-w-2xl text-dust">{server.toolsNote}</p> : null}
      {server.tools.length === 0 ? (
        <p className="mt-6 border-t border-rule py-6 text-ink-soft">
          Tool names are not available in this listing. Check the project documentation before connecting.
        </p>
      ) : (
        <div className="mt-4 border-t border-ink">
          {server.tools.map((tool) => (
            <details key={tool.name} className="group border-b border-rule">
              <summary className="flex cursor-pointer list-none items-baseline justify-between gap-4 py-3">
                <span className="font-mono text-sm">{tool.name}</span>
                <span className="kicker">
                  {tool.permission} · {tool.risk}
                </span>
              </summary>
              <div className="pb-4 pl-0 md:pl-8">
                <p>{tool.summary}</p>
                {tool.inputs.length > 0 ? (
                  <ul className="mt-3 space-y-1 font-mono text-xs text-ink-soft">
                    {tool.inputs.map((input) => (
                      <li key={input.name}>
                        {input.name}: {input.type}
                        {input.note ? ` (${input.note})` : ""}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-dust">Input details are not available here.</p>
                )}
              </div>
            </details>
          ))}
        </div>
      )}
    </section>
  );
}
