/**
 * Tests: 1.1 – 1.6  Auth & Sessions
 */
import { test, expect } from "@playwright/test";

const BASE = "http://localhost:3000";

test.describe("Authentication", () => {
  test("1.1 valid credentials redirect to /admin", async ({ page }) => {
    await page.goto("/admin/login");
    await page.fill("#email", process.env.ADMIN_EMAIL!);
    await page.fill("#password", process.env.ADMIN_PASSWORD!);
    await page.click('button[type="submit"]');
    await page.waitForURL(`${BASE}/admin`, { timeout: 15_000 });
    await expect(page).toHaveURL(`${BASE}/admin`);
  });

  test("1.2 wrong password shows error and stays on login page", async ({ page }) => {
    await page.goto("/admin/login");
    await page.fill("#email", process.env.ADMIN_EMAIL!);
    await page.fill("#password", "definitely-wrong-password-123!");
    await page.click('button[type="submit"]');
    // NextAuth redirects back with ?error=CredentialsSignin — wait for the error element
    await expect(page.getByText(/Invalid email or password/)).toBeVisible({ timeout: 15_000 });
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("1.3 unknown email shows error", async ({ page }) => {
    await page.goto("/admin/login");
    await page.fill("#email", "nobody@nowhere-at-all.example.com");
    await page.fill("#password", "somepassword123");
    await page.click('button[type="submit"]');
    await expect(page.getByText(/Invalid email or password/)).toBeVisible({ timeout: 15_000 });
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("1.5 unauthenticated request to /admin redirects to login", async ({ page }) => {
    await page.goto("/admin");
    await page.waitForURL(/\/admin\/login/, { timeout: 10_000 });
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("1.5 unauthenticated request to /admin/users redirects to login", async ({ page }) => {
    await page.goto("/admin/users");
    await page.waitForURL(/\/admin\/login/, { timeout: 10_000 });
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("1.6 sign out clears session and redirects to login", async ({ browser }) => {
    // Start authenticated with English admin locale so the sign-out button label is English
    const context = await browser.newContext({
      storageState: "tests/e2e/.auth/admin.json",
    });
    await context.addCookies([
      { name: "admin-locale", value: "en", domain: "localhost", path: "/" },
    ]);
    const page = await context.newPage();
    await page.goto("/admin");
    await expect(page).toHaveURL(`${BASE}/admin`);

    // Find and click sign-out button (label is "Sign Out" when admin-locale=en)
    const signOut = page.getByRole("button", { name: /sign out/i });
    await signOut.click();

    // nextauth/react signOut redirects to callbackUrl (/admin/login)
    await page.waitForURL(/\/admin\/login/, { timeout: 15_000 });
    await expect(page).toHaveURL(/\/admin\/login/);
    await context.close();
  });
});
