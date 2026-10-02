"use client";

import Image from "next/image";
import { useState } from "react";

export function ServerMark({ slug, name, size = "normal" }: { slug: string; name: string; size?: "normal" | "large" }) {
  const [failed, setFailed] = useState(false);
  return (
    <span className={`server-mark ${size === "large" ? "server-mark--large" : ""} ${slug === "pollinations" ? "server-mark--pollinations" : ""}`} aria-hidden="true">
      {failed ? <span className="server-mark__letter">{name.slice(0, 1).toUpperCase()}</span> : <Image src={`/brands/${slug}.png`} alt="" width={44} height={44} unoptimized className="server-mark__image" onError={() => setFailed(true)} />}
    </span>
  );
}
