/**
 * Tests: 9.5 – 9.7  Donations (public form + admin list)
 */
import { test, expect } from "./fixtures";

test.describe("Donations", () => {
  test("9.5 donation form validates required fields before submit", async ({ browser }) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto("/en/donate");

    // Click donate without filling the email
    const donateBtn = page.getByRole("button", { name: /donate|寄付する/i });
    await donateBtn.click();

    // Email field should be in an invalid state (native validation or custom error)
    const emailInput = page.locator('input[name="email"], input[type="email"]');
    const isInvalid = await emailInput.evaluate(
      (el: HTMLInputElement) => !el.validity.valid
    ).catch(() => false);
    const hasError = await page
      .getByText(/email.*required|メールアドレス|invalid/i)
      .isVisible({ timeout: 3_000 })
      .catch(() => false);
    expect(isInvalid || hasError).toBeTruthy();
    await ctx.close();
  });

  test("9.6 selecting 'recurring' changes the UI label/description", async ({ browser }) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto("/en/donate");

    // Find the recurring toggle/radio
    const recurringToggle = page
      .getByRole("radio", { name: /monthly|定期|recurring/i })
      .or(page.getByRole("button", { name: /monthly|定期/i }))
      .or(page.locator('input[type="radio"][value="true"], input[type="checkbox"][name="recurring"]'));

    if (await recurringToggle.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await recurringToggle.click();
      // UI should update to reflect recurring mode (e.g., "per month" label)
      await expect(
        page.getByText(/month|月|recurring|定期/i)
      ).toBeVisible({ timeout: 3_000 });
    }
    await ctx.close();
  });

  test("9.7 admin donations list renders without error", async ({ adminPage: page }) => {
    await page.goto("/admin/donations");
    await expect(page).toHaveURL(/\/admin\/donations/);
    const tableOrEmpty = page
      .locator("table")
      .or(page.getByText(/no donations|寄付が見つかりません/i))
      .first();
    await expect(tableOrEmpty).toBeVisible({ timeout: 8_000 });
  });
});
