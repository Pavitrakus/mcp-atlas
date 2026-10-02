import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { journal } from "@/data/journal";

export function generateStaticParams() { return journal.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const note = journal.find((entry) => entry.slug === slug);
  return note ? { title: note.title, description: note.deck } : { title: "Note not found" };
}

export default async function NotePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const note = journal.find((entry) => entry.slug === slug);
  if (!note) notFound();
  return <article className="note"><div className="home-wrap note-header"><Link href="/journal" className="home-text-link">← All guides</Link><p className="home-section-index">{note.readTime}</p><h1>{note.title}</h1><p>{note.deck}</p></div><div className="note-image"><Image src={note.image} alt={note.alt} width={1536} height={1024} sizes="100vw" /></div><div className="home-wrap note-body"><div><span className="home-section-index">On this page</span><ol>{note.sections.map((section, index) => <li key={section.heading}><a href={`#part-${index}`}>{section.heading}</a></li>)}</ol></div><div>{note.sections.map((section, index) => <section id={`part-${index}`} key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>)}<div className="note-sources"><p className="home-section-index">Further reading</p>{note.sources.map((source) => <a href={source.href} key={source.href}>{source.label} ↗</a>)}</div><Link href="/servers" className="home-outro__button">Browse servers <span aria-hidden="true">↗</span></Link></div></div></article>;
}
