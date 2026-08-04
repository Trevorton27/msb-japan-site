/**
 * Tests: 13.10 – 13.12  Social Posts & Accounts (admin UI)
 *
 * Publishing to a real Meta account is a manual test (M-14). These tests
 * cover the admin UI structure and draft post CRUD using the mock provider.
 * If no social account is connected, the compose test is skipped.
 */
import { test, expect } from "./fixtures";

const TS = Date.now();
const TEST_CAPTION = `Playwright test post ${TS}`;

test.describe("Social", () => {
  test("13.10 social page loads and shows Connected Accounts and posts sections", async ({
    adminPage: page,
  }) => {
    await page.goto("/admin/social");
    await expect(page).toHaveURL(/\/admin\/social/);
    await expect(
      page.getByText(/connected accounts|接続済みアカウント/i)
    ).toBeVisible({ timeout: 8_000 });
    // Either posts or an empty state message
    const postsSection = page
      .locator("table")
      .or(page.getByText(/no social posts|ソーシャル投稿はまだ/i))
      .first();
    await expect(postsSection).toBeVisible({ timeout: 5_000 });
  });

  test("13.11 compose form creates a draft post and it appears in the list", async ({
    adminPage: page,
  }) => {
    await page.goto("/admin/social");
    // Skip if no accounts are connected (requires a real Meta OAuth)
    const accountRow = page.locator("tr, li").filter({ has: page.getByText(/facebook|instagram|meta/i) });
    const hasAccount = await accountRow.isVisible({ timeout: 3_000 }).catch(() => false);
    test.skip(!hasAccount, "No connected social accounts — compose test requires a connected account");

    await page.goto("/admin/social/compose");
    await expect(page.locator("h1")).toContainText(/compose|投稿を作成/i);

    await page.fill("#caption", TEST_CAPTION);
    // Select the first available account
    const accountSelect = page.locator('select[name="accountId"]');
    const firstAccountValue = await accountSelect.locator("option").first().getAttribute("value");
    if (firstAccountValue) await accountSelect.selectOption(firstAccountValue);

    await page.getByRole("button", { name: /save|create|post|submit/i }).click();
    await page.waitForURL(/\/admin\/social$/, { timeout: 10_000 });

    // Draft post should appear in the list
    await expect(page.getByText(TEST_CAPTION)).toBeVisible({ timeout: 5_000 });
  });

  test("13.12 delete social post removes it from the list", async ({ adminPage: page }) => {
    await page.goto("/admin/social");
    const postRow = page.locator("tr, div").filter({ hasText: TEST_CAPTION });
    const hasPost = await postRow.isVisible({ timeout: 3_000 }).catch(() => false);
    test.skip(!hasPost, "Test post from 13.11 not found — cannot test delete");

    const deleteBtn = postRow.getByRole("button", { name: /delete|削除/i });
    await deleteBtn.click();
    // Confirm if modal
    const confirmBtn = page.getByRole("button", { name: /delete|削除/i }).last();
    if (await confirmBtn.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await confirmBtn.click();
    }
    await expect(page.getByText(TEST_CAPTION)).not.toBeVisible({ timeout: 8_000 });
  });
});
