import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Allows accessing the dev server (and its HMR websocket) from another
  // device on the LAN — e.g. testing the mobile-responsive work on a real
  // phone by hitting this machine's network IP instead of localhost.
  allowedDevOrigins: ["10.111.217.229"],
};

export default nextConfig;
