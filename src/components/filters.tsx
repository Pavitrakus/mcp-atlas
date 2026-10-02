import Link from "next/link";
import { categories } from "@/data/categories";
import { languagesInCatalog, licensesInCatalog } from "@/lib/search";
import type { SearchFilters } from "@/lib/types";

export function Filters({
  filters,
  base,
  query,
}: {
  filters: SearchFilters;
  base: string;
  query?: string;
}) {
  return (
    <aside className="space-y-6" aria-label="Filters">
      <Group title="Category">
        <FilterLink href={href(base, query, filters, { category: undefined })} current={!filters.category}>
          All
        </FilterLink>
        {categories.map((category) => (
          <FilterLink
            key={category.slug}
            href={href(base, query, filters, { category: category.slug })}
            current={filters.category === category.slug}
          >
            {category.name}
          </FilterLink>
        ))}
      </Group>
      <Group title="API key">
        <FilterLink href={href(base, query, filters, { credential: undefined })} current={!filters.credential}>
          Any
        </FilterLink>
        <FilterLink href={href(base, query, filters, { credential: "none" })} current={filters.credential === "none"}>
          No API key
        </FilterLink>
        <FilterLink href={href(base, query, filters, { credential: "required" })} current={filters.credential === "required"}>
          Key required
        </FilterLink>
      </Group>
      <Group title="Where it runs">
        <FilterLink href={href(base, query, filters, { hosting: undefined })} current={!filters.hosting}>
          Any
        </FilterLink>
        <FilterLink href={href(base, query, filters, { hosting: "local" })} current={filters.hosting === "local"}>
          Local
        </FilterLink>
        <FilterLink href={href(base, query, filters, { hosting: "remote" })} current={filters.hosting === "remote"}>
          Remote
        </FilterLink>
      </Group>
      <Group title="Collection">
        <FilterLink
          href={href(base, query, filters, { weird: undefined, official: undefined, maintenance: undefined })}
          current={!filters.weird && !filters.official && !filters.maintenance}
        >
          All servers
        </FilterLink>
        <FilterLink href={href(base, query, filters, { weird: true })} current={Boolean(filters.weird)}>
          Strange and useful
        </FilterLink>
        <FilterLink href={href(base, query, filters, { official: true })} current={Boolean(filters.official)}>
          Publisher&apos;s own
        </FilterLink>
        <FilterLink href={href(base, query, filters, { maintenance: "archived" })} current={filters.maintenance === "archived"}>
          Archived
        </FilterLink>
        <FilterLink href={href(base, query, filters, { maintenance: "recent" })} current={filters.maintenance === "recent"}>
          Pushed recently
        </FilterLink>
      </Group>
      <Group title="Language">
        {languagesInCatalog().map((language) => (
          <FilterLink key={language} href={href(base, query, filters, { language })} current={filters.language === language}>
            {language}
          </FilterLink>
        ))}
      </Group>
      <Group title="License">
        {licensesInCatalog().map((license) => (
          <FilterLink key={license} href={href(base, query, filters, { license })} current={filters.license === license}>
            {license === "NOASSERTION" ? "Unspecified" : license}
          </FilterLink>
        ))}
      </Group>
    </aside>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="filter-group">
      <p className="kicker">{title}</p>
      <div className="filter-group__links mt-2 flex flex-col items-start gap-1">{children}</div>
    </div>
  );
}

function FilterLink({ href, current, children }: { href: string; current: boolean; children: React.ReactNode }) {
  return (
    <Link href={href} className={`text-sm no-underline ${current ? "text-oxblood" : "text-ink-soft"}`} aria-current={current ? "true" : undefined}>
      {children}
    </Link>
  );
}

function href(base: string, query: string | undefined, filters: SearchFilters, patch: Partial<SearchFilters> & { weird?: boolean }): string {
  const next = { ...filters, ...patch };
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (next.category) params.set("category", next.category);
  if (next.transport) params.set("transport", next.transport);
  if (next.credential) params.set("credential", next.credential);
  if (next.hosting) params.set("hosting", next.hosting);
  if (next.language) params.set("language", next.language);
  if (next.license) params.set("license", next.license);
  if (next.weird) params.set("weird", "1");
  if (next.official) params.set("official", "1");
  if (next.maintenance) params.set("maintenance", next.maintenance);
  const text = params.toString();
  return text ? `${base}?${text}` : base;
}
