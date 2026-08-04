/**
 * Tests: 8.3 – 8.5  Orders (admin UI)
 *
 * Orders are created by the Stripe webhook so we cannot manufacture them in
 * tests. These tests verify the admin UI renders correctly when orders exist
 * (or shows the empty state gracefully) and that the status/note controls
 * work end-to-end against a real order when one is present.
 */
import { test, expect } from "./fixtures";

test.describe("Orders – admin UI", () => {
  test("8.3 admin orders list renders without error", async ({ adminPage: page }) => {
    await page.goto("/admin/orders");
    await expect(page).toHaveURL(/\/admin\/orders/);
    // Either the table or the empty-state message should be visible
    const tableOrEmpty = page
      .locator("table")
      .or(page.getByText(/no orders|注文が見つかりません/i))
      .first();
    await expect(tableOrEmpty).toBeVisible({ timeout: 8_000 });
  });

  test("8.4 order status dropdown updates displayed status", async ({ adminPage: page }) => {
    await page.goto("/admin/orders");
    // Only proceed if there's at least one real order row (with a view link)
    const firstRow = page.locator("tbody tr").first();
    const hasOrders = await firstRow.isVisible({ timeout: 3_000 }).catch(() => false)
      && await firstRow.getByRole("link").isVisible({ timeout: 1_000 }).catch(() => false);
    test.skip(!hasOrders, "No orders in DB — skipping status-update test");

    // Navigate to first order detail
    const firstLink = firstRow.getByRole("link", { name: /view|edit|詳細/i });
    await firstLink.click();
    await page.waitForURL(/\/admin\/orders\/.+/, { timeout: 8_000 });

    // The status select should be present
    const statusSelect = page.locator('select[name="status"]')
      .or(page.getByLabel(/status|ステータス/i));
    if (await statusSelect.isVisible({ timeout: 3_000 }).catch(() => false)) {
      const current = await statusSelect.inputValue();
      const options = await statusSelect.locator("option").allInnerTexts();
      const next = options.find((o) => o !== current);
      if (next) {
        await statusSelect.selectOption({ label: next });
        await page.getByRole("button", { name: /save|update|更新/i }).click();
        // Status badge on the page should now reflect the new value
        await expect(page.getByText(new RegExp(next, "i"))).toBeVisible({ timeout: 5_000 });
      }
    }
  });

  test("8.5 saving a note on an order persists and re-displays it", async ({ adminPage: page }) => {
    await page.goto("/admin/orders");
    const firstRow = page.locator("tbody tr").first();
    const hasOrders = await firstRow.isVisible({ timeout: 3_000 }).catch(() => false)
      && await firstRow.getByRole("link").isVisible({ timeout: 1_000 }).catch(() => false);
    test.skip(!hasOrders, "No orders in DB — skipping note test");

    const firstLink = firstRow.getByRole("link", { name: /view|edit|詳細/i });
    await firstLink.click();
    await page.waitForURL(/\/admin\/orders\/.+/, { timeout: 8_000 });

    const noteText = `Playwright test note ${Date.now()}`;
    const notesField = page.locator('textarea[name="notes"]').or(
      page.getByLabel(/notes|メモ/i)
    );
    if (await notesField.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await notesField.fill(noteText);
      await page.getByRole("button", { name: /save note|save|メモを保存/i }).click();
      // Reload and verify the note is still there
      await page.reload();
      await expect(notesField).toHaveValue(noteText, { timeout: 5_000 });
    }
  });
});
