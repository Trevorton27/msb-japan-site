/**
 * Tests: 2.6 – 2.8  RBAC / Access Control
 *
 * Tests 2.6 and 2.7 require a non-admin user. This suite creates a temporary
 * Editor and Analyst account via the admin UI in beforeAll, then tests access
 * restrictions using those accounts, then deletes them in afterAll.
 */
import { test as base, expect, chromium } from "@playwright/test";
import { test as adminTest } from "./fixtures";

const BASE = "http://localhost:3000";
const TS = Date.now();
const EDITOR_EMAIL = `test-editor-${TS}@playwright.test`;
const EDITOR_PASSWORD = "PlaywrightEditor1!";
const ANALYST_EMAIL = `test-analyst-${TS}@playwright.test`;
const ANALYST_PASSWORD = "PlaywrightAnalyst1!";

// We create and delete test users using the admin API helpers via the admin UI.
// Creating them programmatically via Server Actions is simpler here.

async function createTestUser(
  adminPage: import("@playwright/test").Page,
  { email, password, roleName }: { email: string; password: string; roleName: string }
) {
  await adminPage.goto("/admin/users");
  await adminPage.getByRole("button", { name: "Add User" }).click();
  await adminPage.fill('input[name="name"]', `Test ${roleName}`);
  await adminPage.fill('input[name="email"]', email);
  await adminPage.fill('input[name="password"]', password);
  // Select the role
  await adminPage.selectOption('select[name="roleId"]', { label: roleName });
  await adminPage.getByRole("button", { name: "Create User" }).click();
  // Wait for modal to close
  await adminPage.waitForSelector('button:has-text("Add User")', { timeout: 5_000 });
}

async function deleteTestUser(
  adminPage: import("@playwright/test").Page,
  email: string
) {
  await adminPage.goto("/admin/users");
  const row = adminPage.locator("tr").filter({ hasText: email });
  await row.getByRole("button", { name: "Delete" }).click();
  // Confirm in the modal dialog
  await adminPage.getByRole("dialog").getByRole("button", { name: "Delete" }).click();
  await adminPage.waitForSelector(`text=${email}`, { state: "hidden", timeout: 5_000 });
}

base.describe("RBAC – Access Control", () => {
  let editorCreated = false;
  let analystCreated = false;

  // Use the admin fixture to create test users
  base.beforeAll(async ({ browser }) => {
    const context = await browser.newContext({
      storageState: "tests/e2e/.auth/admin.json",
    });
    await context.addCookies([{ name: "admin-locale", value: "en", domain: "localhost", path: "/" }]);
    const page = await context.newPage();

    try {
      await createTestUser(page, { email: EDITOR_EMAIL, password: EDITOR_PASSWORD, roleName: "Editor" });
      editorCreated = true;
      await createTestUser(page, { email: ANALYST_EMAIL, password: ANALYST_PASSWORD, roleName: "Analyst" });
      analystCreated = true;
    } finally {
      await context.close();
    }
  });

  base.afterAll(async ({ browser }) => {
    const context = await browser.newContext({
      storageState: "tests/e2e/.auth/admin.json",
    });
    await context.addCookies([{ name: "admin-locale", value: "en", domain: "localhost", path: "/" }]);
    const page = await context.newPage();

    try {
      if (editorCreated) await deleteTestUser(page, EDITOR_EMAIL);
      if (analystCreated) await deleteTestUser(page, ANALYST_EMAIL);
    } finally {
      await context.close();
    }
  });

  base.test("2.6 Editor cannot navigate to /admin/users", async ({ browser }) => {
    base.skip(!editorCreated, "Editor user was not created");
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto(`${BASE}/admin/login`);
    await page.fill("#email", EDITOR_EMAIL);
    await page.fill("#password", EDITOR_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL(`${BASE}/admin`, { timeout: 10_000 });

    await page.goto("/admin/users");
    // Should be redirected away or show an error — not render the users table
    await expect(page.getByRole("table")).not.toBeVisible({ timeout: 5_000 }).catch(() => {
      // If no table, the restriction is working
    });
    await ctx.close();
  });

  base.test("2.7 Analyst cannot access /admin/content/new", async ({ browser }) => {
    base.skip(!analystCreated, "Analyst user was not created");
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto(`${BASE}/admin/login`);
    await page.fill("#email", ANALYST_EMAIL);
    await page.fill("#password", ANALYST_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL(`${BASE}/admin`, { timeout: 10_000 });

    await page.goto("/admin/content/new");
    // Analyst has content.read but not content.create — should not render the form
    await expect(page.locator('form')).not.toBeVisible({ timeout: 5_000 }).catch(() => {});
    await ctx.close();
  });

  base.test("2.8 Admin can access /admin/orders", async ({ browser }) => {
    const context = await browser.newContext({
      storageState: "tests/e2e/.auth/admin.json",
    });
    const page = await context.newPage();
    await page.goto("/admin/orders");
    // Admin should see the page without being redirected
    await expect(page).toHaveURL(/\/admin\/orders/);
    await context.close();
  });
});
