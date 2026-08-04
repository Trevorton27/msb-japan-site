import { test as base, type Page, type BrowserContext } from "@playwright/test";
import path from "path";

export const ADMIN_AUTH = path.join(
  process.cwd(),
  "tests/e2e/.auth/admin.json"
);

/** Sets admin-locale=en cookie so all labels are in English. */
async function setEnLocale(context: BrowserContext) {
  await context.addCookies([
    {
      name: "admin-locale",
      value: "en",
      domain: "localhost",
      path: "/",
    },
  ]);
}

type Fixtures = {
  /** A Page that is already authenticated as the admin user. */
  adminPage: Page;
};

export const test = base.extend<Fixtures>({
  adminPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: ADMIN_AUTH,
    });
    await setEnLocale(context);
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
});

export { expect } from "@playwright/test";

/**
 * Sign in via the login form and return the page.
 * Useful for tests that need to log in as a specific non-admin user.
 */
export async function signInAs(
  page: Page,
  email: string,
  password: string,
  baseURL = "http://localhost:3000"
) {
  await page.goto(`${baseURL}/admin/login`);
  await page.fill("#email", email);
  await page.fill("#password", password);
  await page.click('button[type="submit"]');
  await page.waitForURL(`${baseURL}/admin`, { timeout: 10_000 });
}
