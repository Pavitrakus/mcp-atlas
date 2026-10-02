import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import { Shell } from "@/components/shell";
import "./globals.css";
import "./refresh.css";
import "./polish.css";

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex",
  weight: ["400", "500"],
  style: ["normal", "italic"],
});

const base = process.env.ATLAS_PUBLIC_URL ?? "http://127.0.0.1:43123";

export const metadata: Metadata = {
  metadataBase: new URL(base),
  title: {
    default: "Atlas, a field guide to machine abilities",
    template: "%s · Atlas",
  },
  description:
    "An open field guide to MCP servers: what they let an assistant do, how to install them, and a public ledger for the abilities that do not exist yet.",
  openGraph: {
    title: "Atlas",
    description: "A field guide to what machines can now do.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={mono.variable} suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: 'try{var t=localStorage.getItem("atlas-theme");document.documentElement.dataset.theme=t==="dark"?"dark":"light"}catch(e){document.documentElement.dataset.theme="light"}' }} /></head>
      <body>
        <a href="#content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-paper focus:px-3 focus:py-2">
          Skip to content
        </a>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
