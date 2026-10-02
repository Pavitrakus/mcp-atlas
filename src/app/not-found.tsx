import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-5 py-16 md:px-8">
      <p className="kicker">Blank leaf</p>
      <h1 className="display mt-3 text-5xl">Nothing is printed on this page.</h1>
      <p className="mt-4">
        <Link href="/search">Search the edition</Link>
        {" · "}
        <Link href="/requests/new">Request the missing thing</Link>
      </p>
    </div>
  );
}
