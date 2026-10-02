"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export function IndexDialog({ links }: { links: { href: string; label: string }[] }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    function onClose() {
      dialog?.close();
    }
    dialog.addEventListener("cancel", onClose);
    return () => dialog.removeEventListener("cancel", onClose);
  }, []);

  return (
    <>
      <button type="button" className="site-menu-button md:hidden" aria-label="Open menu" aria-haspopup="dialog" onClick={() => ref.current?.showModal()}>
        <span /><span /><span />
      </button>
      <dialog ref={ref} className="site-menu-dialog paper-slip m-auto w-[min(100%,28rem)] bg-paper p-0 text-ink backdrop:bg-[#171714]/50">
        <div className="flex items-center justify-between border-b border-rule px-5 py-4">
          <p className="text-xl font-semibold">Menu</p>
          <button type="button" className="text-sm font-semibold" onClick={() => ref.current?.close()}>
            Close
          </button>
        </div>
        <nav className="flex flex-col px-5 py-4" aria-label="Mobile">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="border-b border-rule py-3 font-display text-3xl no-underline" onClick={() => ref.current?.close()}>
              {link.label}
            </Link>
          ))}
          <Link href="/about" className="py-3 font-display text-3xl no-underline" onClick={() => ref.current?.close()}>
            About
          </Link>
          <Link href="/for-bots" className="border-t border-rule py-3 font-display text-3xl no-underline" onClick={() => ref.current?.close()}>
            For bots
          </Link>
        </nav>
      </dialog>
    </>
  );
}
