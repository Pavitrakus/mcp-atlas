import { ImageResponse } from "next/og";
import { getServer, languageOf, plateNumber } from "@/lib/catalog";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const server = getServer(slug);
  const name = server?.name ?? "Missing plate";
  const summary = server?.summary ?? "This edition has no such server.";
  const plate = server ? plateNumber(server) : "000";
  const language = server ? languageOf(server) : null;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#f3efe6",
          color: "#171714",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          border: "16px solid #171714",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", letterSpacing: 4, fontSize: 18, textTransform: "uppercase" }}>
          <span>The Atlas</span>
          <span>Plate {plate}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 84, lineHeight: 0.95, letterSpacing: -2 }}>{name}</div>
          <div style={{ marginTop: 24, fontSize: 28, maxWidth: 860, color: "#2a2924" }}>{summary}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20 }}>
          <span>{server ? `${server.tools.length} tools transcribed` : ""}</span>
          <span>{[language, server?.hosting, "Open edition"].filter(Boolean).join(" · ")}</span>
        </div>
      </div>
    ),
    size,
  );
}
