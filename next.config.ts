import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["better-sqlite3"],
  // The dev server is bound on 0.0.0.0. Browsers that open 127.0.0.1 are otherwise
  // refused the hot-reload socket, and the client never finishes hydrating.
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
