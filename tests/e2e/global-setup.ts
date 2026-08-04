import { chromium, type FullConfig } from "@playwright/test";
import { mkdirSync, readFileSync } from "fs";
import path from "path";

function loadEnvLocal() {
  try {
    const content = readFileSync(path.join(process.cwd(), ".env.local"), "utf-8");
    for (const line of content.split("\n")) {
      const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const val = match[2].trim().replace(/^["']|["']$/g, "");
        if (!process.env[key]) process.env[key] = val;
      }
    }
  } catch {
    // .env.local not found — rely on environment variables being pre-set
  }
}

export default async function globalSetup(config: FullConfig) {
  loadEnvLocal();

  const baseURL =
    config.projects[0]?.use?.baseURL ?? "http://localhost:3000";

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error(
      "ADMIN_EMAIL and ADMIN_PASSWORD must be set (in .env.local or the environment) to run E2E tests."
    );
  }

  const authDir = path.join(process.cwd(), "tests/e2e/.auth");
  mkdirSync(authDir, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(`${baseURL}/admin/login`);
  await page.waitForSelector("#email", { timeout: 10_000 });
  await page.fill("#email", email);
  await page.fill("#password", password);
  await page.click('button[type="submit"]');

  // Wait for any navigation away from the login page (success or error).
  // NextAuth v5 may pass through intermediate callback URLs before landing on /admin.
  await page.waitForURL(
    (url) =>
      !url.pathname.startsWith("/admin/login") &&
      url.pathname.startsWith("/admin"),
    { timeout: 30_000 }
  );

  // Verify we're not on an error page
  const currentUrl = page.url();
  if (currentUrl.includes("/admin/login")) {
    throw new Error(
      `Login failed — still on login page. Check ADMIN_EMAIL/ADMIN_PASSWORD and that the admin user is seeded. URL: ${currentUrl}`
    );
  }

  await context.storageState({
    path: path.join(authDir, "admin.json"),
  });

  await browser.close();
}
