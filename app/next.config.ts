import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produces a self-contained server in .next/standalone that includes only
  // the minimal Node.js dependencies needed to run. The Electron main process
  // can require() this server directly using its own built-in Node runtime —
  // no separate Node.js installation is needed on the end user's machine.
  output: "standalone",
};

export default nextConfig;
