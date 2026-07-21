import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "prisma/config";

// Load .env.local or .env for Prisma CLI commands
const root = path.join(__dirname, "..");
const envFile = fs.existsSync(path.join(root, ".env.local"))
  ? path.join(root, ".env.local")
  : path.join(root, ".env");
for (const line of fs.readFileSync(envFile, "utf-8").split("\n")) {
  const match = line.match(/^\s*([^#=]+?)\s*=\s*(.*)\s*$/);
  if (match && match[1] && !process.env[match[1]]) {
    process.env[match[1]] = match[2] ?? "";
  }
}

export default defineConfig({
  schema: path.join(__dirname, "schema.prisma"),
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
