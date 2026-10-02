import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${process.env.ATLAS_PUBLIC_URL ?? "http://127.0.0.1:43123"}/sitemap.xml`,
  };
}
