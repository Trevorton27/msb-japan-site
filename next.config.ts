import type { NextConfig } from "next";
import { securityHeaders } from "@/lib/security/headers";
import { legacyRedirects } from "./prisma/seed-data/legacy-content";

const nextConfig: NextConfig = {
  headers: securityHeaders,
  // Preserve inbound links to the old BiND site's .html URLs. The proxy skips
  // paths with a file extension, so these are handled here rather than by the
  // admin-managed Redirect table.
  async redirects() {
    return legacyRedirects.map((r) => ({
      source: r.fromPath,
      destination: r.toPath,
      permanent: true,
    }));
  },
};

export default nextConfig;
