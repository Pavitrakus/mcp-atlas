import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { journal } from "@/data/journal";

export const metadata: Metadata = { title: "Field notes", description: "Short, useful writing about MCP servers and the choices around them." };

export default function JournalPage() {
  return <div className="journal home-wrap"><header className="journal-header"><h1>Understand MCP.</h1><p>Plain-language guides to what these servers do and how to choose one.</p></header><div className="journal-grid">{journal.map((note) => <Link href={`/journal/${note.slug}`} key={note.slug} className="journal-card"><div className="journal-card__image"><Image src={note.image} alt={note.alt} width={1000} height={680} sizes="(min-width: 900px) 33vw, 100vw" /></div><div className="journal-card__meta"><span>{note.readTime}</span></div><h2>{note.title}</h2><p>{note.deck}</p><span className="journal-card__arrow" aria-hidden="true">↗</span></Link>)}</div></div>;
}
