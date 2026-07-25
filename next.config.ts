import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removes the `X-Powered-By: Next.js` response header — no functional
  // benefit to advertising the framework in production.
  poweredByHeader: false,

  // Allows accessing the dev server (and its HMR websocket) from another
  // device on the LAN — e.g. testing the mobile-responsive work on a real
  // phone by hitting this machine's network IP instead of localhost.
  // Only applies to `next dev`, harmless in production.
  allowedDevOrigins: ["10.111.217.229"],

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        // Unlike /_next/static/ (already immutable-cached by Next itself),
        // files served straight from /public — the Earth textures, satellite
        // model, logo — default to `max-age=0`, so every repeat visit
        // re-downloads them from origin. A day of caching (not a full year
        // "immutable", since these filenames have no content hash — if a
        // texture is ever swapped at the same path, that's still a
        // reasonable staleness window) meaningfully helps repeat visits.
        source: "/assets/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
      },
    ];
  },
};

export default nextConfig;
