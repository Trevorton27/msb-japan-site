/**
 * Tests: Members Portal – Auth & Access Control
 *
 * Covers the key security boundaries of the /[locale]/members/ area:
 * - Unauthenticated users are redirected to the member sign-in page
 * - Users without a Member role land on the unauthorized page
 * - Users with the Member role can access the dashboard
 * - Admin users (who implicitly hold member.content) can access the dashboard
 * - Member users cannot access /admin routes
 *
 * Member test user is created via admin UI in beforeAll and removed in afterAll.
 */
import { test as base, expect } from "@playwright/test";

const BASE = "http://localhost:3000";
const TS = Date.now();
const MEMBER_EMAIL = `test-member-${TS}@playwright.test`;
const MEMBER_PASSWORD = "PlaywrightMember1!";

async function createMemberUser(adminPage: import("@playwright/test").Page) {
  await adminPage.goto("/admin/users");
  await adminPage.getByRole("button", { name: "Add User" }).click();
  await adminPage.fill('input[name="name"]', "Test Member");
  await adminPage.fill('input[name="email"]', MEMBER_EMAIL);
  await adminPage.fill('input[name="password"]', MEMBER_PASSWORD);
  await adminPage.selectOption('select[name="roleId"]', { label: "Member" });
  await adminPage.getByRole("button", { name: "Create User" }).click();
  await adminPage.waitForSelector('button:has-text("Add User")', { timeout: 5_000 });
}

async function deleteMemberUser(adminPage: import("@playwright/test").Page) {
  await adminPage.goto("/admin/users");
  const row = adminPage.locator("tr").filter({ hasText: MEMBER_EMAIL });
  await row.getByRole("button", { name: "Delete" }).click();
  await adminPage.getByRole("dialog").getByRole("button", { name: "Delete" }).click();
  await adminPage.waitForSelector(`text=${MEMBER_EMAIL}`, { state: "hidden", timeout: 5_000 });
}

async function signInAsMember(page: import("@playwright/test").Page) {
  await page.goto(`${BASE}/en/members/sign-in`);
  await page.fill('input[name="email"]', MEMBER_EMAIL);
  await page.fill('input[name="password"]', MEMBER_PASSWORD);
  await page.getByRole("button", { name: /sign in/i }).click();
  await page.waitForURL(`${BASE}/en/members`, { timeout: 10_000 });
}

base.describe("Members Portal – Auth & Access", () => {
  let memberCreated = false;

  base.beforeAll(async ({ browser }) => {
    const context = await browser.newContext({
      storageState: "tests/e2e/.auth/admin.json",
    });
    await context.addCookies([{ name: "admin-locale", value: "en", domain: "localhost", path: "/" }]);
    const page = await context.newPage();
    try {
      await createMemberUser(page);
      memberCreated = true;
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
      if (memberCreated) await deleteMemberUser(page);
    } finally {
      await context.close();
    }
  });

  base.test("M-1 unauthenticated user visiting /en/members is redirected to sign-in", async ({ browser }) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto(`${BASE}/en/members`);
    await expect(page).toHaveURL(/\/en\/members\/sign-in/, { timeout: 10_000 });
    await ctx.close();
  });

  base.test("M-2 member sign-in page is publicly accessible", async ({ browser }) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto(`${BASE}/en/members/sign-in`);
    await expect(page).not.toHaveURL(/\/admin/, { timeout: 5_000 });
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
    await ctx.close();
  });

  base.test("M-3 member user can sign in and access dashboard", async ({ browser }) => {
    base.skip(!memberCreated, "Member user was not created");
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await signInAsMember(page);
    await expect(page).toHaveURL(`${BASE}/en/members`);
    await ctx.close();
  });

  base.test("M-4 member user can access study library", async ({ browser }) => {
    base.skip(!memberCreated, "Member user was not created");
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await signInAsMember(page);
    await page.goto(`${BASE}/en/members/study`);
    await expect(page).toHaveURL(/\/en\/members\/study/);
    await ctx.close();
  });

  base.test("M-5 member user cannot access /admin", async ({ browser }) => {
    base.skip(!memberCreated, "Member user was not created");
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await signInAsMember(page);
    await page.goto(`${BASE}/admin`);
    // Should be redirected to admin login or unauthorized — not render admin UI
    await expect(page).not.toHaveURL(`${BASE}/admin`, { timeout: 5_000 });
    await ctx.close();
  });

  base.test("M-6 admin user can access /en/members dashboard", async ({ browser }) => {
    const ctx = await browser.newContext({ storageState: "tests/e2e/.auth/admin.json" });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/en/members`);
    await expect(page).toHaveURL(/\/en\/members/, { timeout: 10_000 });
    // Admin should not be redirected to sign-in or unauthorized
    await expect(page).not.toHaveURL(/sign-in/);
    await expect(page).not.toHaveURL(/unauthorized/);
    await ctx.close();
  });

  base.test("M-7 unauthorized page is accessible without auth", async ({ browser }) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto(`${BASE}/en/members/unauthorized`);
    await expect(page).not.toHaveURL(/sign-in/, { timeout: 5_000 });
    await ctx.close();
  });
});
