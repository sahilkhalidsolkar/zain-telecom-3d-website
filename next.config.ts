import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: this app is 100% client components with no API routes,
  // middleware, or server-side data fetching, so it needs no Node server at
  // runtime — `pnpm build` produces a plain `out/` folder of static files,
  // which is what makes Render's (cheaper, simpler) Static Site hosting an
  // option here instead of a Web Service.
  output: "export",

  // Removes the `X-Powered-By: Next.js` response header — no functional
  // benefit to advertising the framework. (Static export has no server to
  // actually send response headers from; this only matters if `next dev`/
  // `next start` is ever used locally.)
  poweredByHeader: false,

  // Allows accessing the dev server (and its HMR websocket) from another
  // device on the LAN — e.g. testing the mobile-responsive work on a real
  // phone by hitting this machine's network IP instead of localhost.
  // Only applies to `next dev`, harmless in production.
  allowedDevOrigins: ["10.111.217.229"],

  // There used to be a `headers()` config here (security headers + a
  // longer Cache-Control for /assets/*) — removed because Next.js does not
  // apply `headers()`/`redirects()`/`rewrites()` to a static export
  // (confirmed: `next build` still succeeds but prints a warning and the
  // headers are silently never sent). A Static Site host serves the `out/`
  // folder directly with no Node process left to apply them from — the
  // equivalent headers need to be configured on the host itself instead.
};

export default nextConfig;
