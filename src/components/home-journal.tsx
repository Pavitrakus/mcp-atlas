import Image from "next/image";
import Link from "next/link";
import { journal } from "@/data/journal";

export function HomeJournal() {
  return (
    <section className="home-wrap home-section" aria-labelledby="notes-title">
      <div className="home-section-heading">
        <div><h2 id="notes-title">Learn the basics</h2><p>Clear explanations for choosing and using MCP servers.</p></div>
        <Link href="/journal" className="fresh-text-link">All guides <span aria-hidden="true">↗</span></Link>
      </div>
      <div className="journal-grid journal-grid--home">
        {journal.map((note) => (
          <Link href={`/journal/${note.slug}`} key={note.slug} className="journal-card">
            <div className="journal-card__image"><Image src={note.image} alt={note.alt} width={1000} height={680} sizes="(min-width: 900px) 33vw, 100vw" /></div>
            <div className="journal-card__meta"><span>{note.readTime}</span></div>
            <h3>{note.title}</h3><p>{note.deck}</p><span className="journal-card__arrow" aria-hidden="true">↗</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
