"use client";

import Link from "next/link";
import { useState } from "react";

export type Node = {
  slug: string;
  name: string;
  count: number;
  ring: "outer" | "inner";
};

export function Astrolabe({ nodes }: { nodes: Node[] }) {
  const [active, setActive] = useState<string | null>(nodes[0]?.slug ?? null);
  const current = nodes.find((node) => node.slug === active) ?? nodes[0];
  const outer = nodes.filter((node) => node.ring === "outer");
  const inner = nodes.filter((node) => node.ring === "inner");

  return (
    <figure className="grid items-center gap-6 lg:grid-cols-[minmax(0,1fr)_16rem]">
      <div className="relative">
        <svg viewBox="0 0 760 760" className="h-auto w-full" role="img" aria-labelledby="chart-title chart-desc">
          <title id="chart-title">MCP server categories</title>
          <desc id="chart-desc">A circular chart of categories. Choose one to browse its servers.</desc>
          <circle cx="380" cy="380" r="352" fill="none" stroke="currentColor" strokeOpacity=".8" strokeWidth="1.2" />
          <circle cx="380" cy="380" r="338" fill="none" stroke="currentColor" strokeOpacity=".45" strokeWidth="0.4" />
          <circle cx="380" cy="380" r="248" fill="none" stroke="currentColor" strokeOpacity=".45" strokeWidth="0.6" />
          <circle cx="380" cy="380" r="150" fill="none" stroke="currentColor" strokeOpacity=".35" strokeWidth="0.45" />
          {Array.from({ length: 72 }, (_, index) => {
            const angle = (index / 72) * Math.PI * 2;
            const long = index % 6 === 0;
            const r1 = long ? 318 : 328;
            const r2 = 338;
            return (
              <line
                key={index}
                x1={380 + Math.cos(angle) * r1}
                y1={380 + Math.sin(angle) * r1}
                x2={380 + Math.cos(angle) * r2}
                y2={380 + Math.sin(angle) * r2}
                stroke="currentColor"
                strokeOpacity={long ? .55 : .3}
                strokeWidth={long ? 1 : 0.4}
              />
            );
          })}
          <path d="M380 92 L390 380 L380 404 L370 380 Z" className="fill-oxblood" />
          <circle cx="380" cy="380" r="3.2" className="fill-ink" />
          <text x="380" y="436" textAnchor="middle" className="fill-ink" style={{ fontFamily: "var(--font-display)", fontSize: 18 }}>
            Abilities
          </text>
          <Ring nodes={outer} radius={292} active={active} onActive={setActive} />
          <Ring nodes={inner} radius={196} active={active} onActive={setActive} />
        </svg>
      </div>
      <figcaption className="paper-slip p-5">
        <p className="kicker">Selected category</p>
        {current ? (
          <>
            <p className="display mt-3 text-4xl">{current.name}</p>
            <p className="mt-3 text-sm text-ink-soft">
              {current.count} {current.count === 1 ? "server" : "servers"}
            </p>
            <Link href={`/capabilities/${current.slug}`} className="mt-5 inline-block kicker text-oxblood no-underline">
              View servers
            </Link>
          </>
        ) : null}
        <p className="mt-6 text-sm text-dust">
          A server can appear in more than one category.
        </p>
      </figcaption>
    </figure>
  );
}

function shortName(slug: string, name: string): string {
  const labels: Record<string, string> = {
    "creative-tools": "CREATIVE",
    "local-systems": "LOCAL",
    communication: "COMMS",
    productivity: "TASKS",
    geospatial: "MAPS",
    computation: "COMPUTE",
    databases: "DATA",
  };
  return labels[slug] ?? name.toUpperCase();
}

function Ring({
  nodes,
  radius,
  active,
  onActive,
}: {
  nodes: Node[];
  radius: number;
  active: string | null;
  onActive: (slug: string) => void;
}) {
  return (
    <>
      {nodes.map((node, index) => {
        const angle = (index / nodes.length) * Math.PI * 2 - Math.PI / 2 + Math.PI / nodes.length;
        const x = 380 + Math.cos(angle) * radius;
        const y = 380 + Math.sin(angle) * radius;
        const labelRadius = radius + (radius > 240 ? 28 : -28);
        const lx = 380 + Math.cos(angle) * labelRadius;
        const ly = 380 + Math.sin(angle) * labelRadius;
        const on = active === node.slug;
        return (
          <Link
            key={node.slug}
            href={`/capabilities/${node.slug}`}
            onMouseEnter={() => onActive(node.slug)}
            onFocus={() => onActive(node.slug)}
            aria-label={`${node.name}, ${node.count} servers`}
          >
            <circle cx={x} cy={y} r={on ? 7 : 4.5} className={on ? "fill-oxblood" : "fill-ink"} />
            <text
              x={lx}
              y={ly}
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ fontFamily: "var(--font-mono)", fontSize: radius > 240 ? 10 : 9, letterSpacing: "0.12em" }}
              className={on ? "fill-oxblood" : "fill-ink"}
            >
              {shortName(node.slug, node.name)}
            </text>
          </Link>
        );
      })}
    </>
  );
}
