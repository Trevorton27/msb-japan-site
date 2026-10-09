import type { NextConfig } from "next";
import { securityHeaders } from "@/lib/security/headers";
import { legacyRedirects } from "./prisma/seed-data/legacy-content";

const nextConfig: NextConfig = {
  headers: securityHeaders,
  // The admin dashboard assistant reads the manual and dashboard source at
  // runtime (src/server/admin-assistant/knowledge.ts).
  outputFileTracingIncludes: {
    "/api/admin/assistant": [
      "./docs/admin dashboard user's manual.md",
      "./src/app/admin/**/*.{ts,tsx}",
      "./src/components/admin/**/*.{ts,tsx}",
      "./src/server/actions/**/*.ts",
      "./src/lib/admin-labels.ts",
      "./src/lib/auth/permissions.ts",
      "./src/lib/validation/schemas.ts",
    ],
  },
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
