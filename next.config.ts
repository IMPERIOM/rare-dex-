import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";
import dns from "dns";

try {
  dns.setDefaultResultOrder("ipv4first");
} catch {}

const root = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Pin Turbopack root — avoids "Next.js package not found" when the project
  // path contains unusual segments (e.g. a literal "~" directory).
  turbopack: {
    root,
  },
};

export default nextConfig;
