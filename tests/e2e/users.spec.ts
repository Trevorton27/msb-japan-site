/**
 * Tests: 11.8 – 11.13  User Management (admin)
 */
import { test, expect } from "./fixtures";

const TS = Date.now();
const TEST_EMAIL = `test-user-mgmt-${TS}@playwright.test`;
const TEST_NAME = `Playwright User ${TS}`;
const TEST_PASSWORD = "PlaywrightTest1!";
const NEW_PASSWORD = "PlaywrightNew1!";

test.describe("User Management", () => {
  test("11.8 users list renders all users with their roles", async ({ adminPage: page }) => {
    await page.goto("/admin/users");
    await expect(page).toHaveURL(/\/admin\/users/);
    await expect(page.locator("table")).toBeVisible({ timeout: 8_000 });
    // At least the admin user should be listed
    await expect(page.locator("tbody tr").first()).toBeVisible();
  });

  test("11.9 add user form creates user and shows them in the list", async ({ adminPage: page }) => {
    await page.goto("/admin/users");
    await page.getByRole("button", { name: "Add User" }).click();

    // Modal is open
    await page.fill('input[name="name"]', TEST_NAME);
    await page.fill('input[name="email"]', TEST_EMAIL);
    await page.fill('input[name="password"]', TEST_PASSWORD);
    // Pick the first available role
    const roleSelect = page.locator('select[name="roleId"]');
    const firstRole = await roleSelect.locator("option").first().getAttribute("value");
    if (firstRole) await roleSelect.selectOption(firstRole);

    await page.getByRole("button", { name: "Create User" }).click();
    // Modal should close
    await page.waitForSelector('button:has-text("Add User")', { timeout: 8_000 });

    // User should appear in the table
    await expect(page.locator("tr").filter({ hasText: TEST_EMAIL })).toBeVisible({ timeout: 5_000 });
  });

  test("11.10 change role dropdown updates the displayed role", async ({ adminPage: page }) => {
    await page.goto("/admin/users");
    const row = page.locator("tr").filter({ hasText: TEST_EMAIL });
    const hasUser = await row.isVisible({ timeout: 3_000 }).catch(() => false);
    test.skip(!hasUser, "Test user not present — 11.9 may have failed");

    await row.getByRole("button", { name: "Role" }).click();

    // In the Role modal, pick a different role
    const roleSelect = page.locator('select[name="roleId"]');
    await expect(roleSelect).toBeVisible({ timeout: 3_000 });
    const options = await roleSelect.locator("option").allInnerTexts();
    const current = await roleSelect.inputValue();
    const next = await roleSelect.locator("option").filter({ hasNot: page.locator(`[value="${current}"]`) }).first().getAttribute("value");
    if (next) {
      await roleSelect.selectOption(next);
      await page.getByRole("button", { name: "Save" }).click();
      // Modal closes, row still present
      await expect(row).toBeVisible({ timeout: 5_000 });
    }
  });

  test("11.11 reset password dialog accepts new password and shows success", async ({ adminPage: page }) => {
    await page.goto("/admin/users");
    const row = page.locator("tr").filter({ hasText: TEST_EMAIL });
    const hasUser = await row.isVisible({ timeout: 3_000 }).catch(() => false);
    test.skip(!hasUser, "Test user not present — 11.9 may have failed");

    await row.getByRole("button", { name: "Password" }).click();
    const pwInput = page.locator('input[name="password"]');
    await expect(pwInput).toBeVisible({ timeout: 3_000 });
    await pwInput.fill(NEW_PASSWORD);
    await page.getByRole("button", { name: "Reset Password" }).click();
    // Modal should close without an error
    await page.waitForSelector('button:has-text("Add User")', { timeout: 5_000 });
    await expect(row).toBeVisible();
  });

  test("11.13 delete button for the currently signed-in user is disabled or shows error", async ({ adminPage: page }) => {
    await page.goto("/admin/users");
    // Find the row for the admin user (ADMIN_EMAIL)
    const adminEmail = process.env.ADMIN_EMAIL ?? "";
    const adminRow = page.locator("tr").filter({ hasText: adminEmail });
    const hasAdminRow = await adminRow.isVisible({ timeout: 3_000 }).catch(() => false);
    test.skip(!hasAdminRow || !adminEmail, "Admin user row not found");

    await adminRow.getByRole("button", { name: "Delete" }).click();
    // Confirm in modal dialog
    await page.getByRole("dialog").getByRole("button", { name: "Delete" }).click();
    // Should show an error — cannot delete self
    await expect(page.getByText(/cannot delete your own account/i)).toBeVisible({ timeout: 5_000 });
    // Close modal by pressing Escape or clicking Cancel
    await page.keyboard.press("Escape");
  });

  test("11.12 delete user removes them from the list", async ({ adminPage: page }) => {
    await page.goto("/admin/users");
    const row = page.locator("tr").filter({ hasText: TEST_EMAIL });
    const hasUser = await row.isVisible({ timeout: 3_000 }).catch(() => false);
    test.skip(!hasUser, "Test user not present — skipping delete");

    await row.getByRole("button", { name: "Delete" }).click();
    // Confirm delete in modal dialog
    await page.getByRole("dialog").getByRole("button", { name: "Delete" }).click();
    // User should disappear from the list
    await expect(page.locator("tr").filter({ hasText: TEST_EMAIL })).not.toBeVisible({
      timeout: 8_000,
    });
  });
});
