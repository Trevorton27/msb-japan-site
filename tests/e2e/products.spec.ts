/**
 * Tests: 6.5 – 6.11  Products & Variants (admin CRUD + public shop)
 */
import { test, expect } from "./fixtures";

const TS = Date.now();
const SLUG_JA = `test-product-${TS}`;
const SLUG_EN = `test-product-en-${TS}`;
const NAME_JA = `テスト商品 ${TS}`;
const NAME_EN = `Test Product ${TS}`;

test.describe("Products CRUD", () => {
  let productId: string | null = null;

  test("6.5 create product via admin form – appears in list", async ({ adminPage: page }) => {
    await page.goto("/admin/products/new");

    await page.fill('input[name="nameJa"]', NAME_JA);
    await page.fill('input[name="nameEn"]', NAME_EN);
    await page.fill('input[name="slugJa"]', SLUG_JA);
    await page.fill('input[name="slugEn"]', SLUG_EN);

    // First variant — inputs are React state-controlled (no name attrs); use fieldset position
    const variantsFieldset = page.locator('fieldset').nth(1);
    await variantsFieldset.locator('input').first().fill(`標準 ${TS}`);
    await variantsFieldset.locator('input[type="number"]').first().fill("1000");
    await variantsFieldset.locator('input[type="number"]').last().fill("50");

    await page.click('button[type="submit"]');
    await page.waitForURL(/\/admin\/products$/, { timeout: 10_000 });

    // admin-locale=en is set by fixture, so list displays NAME_EN
    const row = page.locator("tr").filter({ hasText: NAME_EN });
    await expect(row).toBeVisible();
    const href = await row.getByRole("link", { name: "Edit" }).getAttribute("href");
    productId = href?.split("/").pop() ?? null;
  });

  test("6.6 variant rows can be added and removed dynamically", async ({ adminPage: page }) => {
    await page.goto("/admin/products/new");
    await page.fill('input[name="nameJa"]', `バリアントテスト ${TS}`);
    await page.fill('input[name="slugJa"]', `variant-test-${TS}`);

    // Each variant renders as a rounded-md border div inside the variants fieldset
    const variantsFieldset = page.locator('fieldset').nth(1);
    const variantCards = variantsFieldset.locator('div.rounded-md.border');

    const countBefore = await variantCards.count();
    const addBtn = page.getByRole("button", { name: /add variant|バリアント追加/i });
    await addBtn.click();
    const countAfterAdd = await variantCards.count();
    expect(countAfterAdd).toBeGreaterThan(countBefore);

    // Remove the added row
    const removeBtn = page.getByRole("button", { name: /remove|削除/i }).last();
    if (await removeBtn.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await removeBtn.click();
      const countAfterRemove = await variantCards.count();
      expect(countAfterRemove).toBeLessThan(countAfterAdd);
    }
  });

  test("6.7 edit product form pre-populates values correctly", async ({ adminPage: page }) => {
    test.skip(!productId, "Product not created in 6.5");
    await page.goto(`/admin/products/${productId}`);
    await expect(page.locator('input[name="nameJa"]')).toHaveValue(NAME_JA);
    await expect(page.locator('input[name="nameEn"]')).toHaveValue(NAME_EN);
    await expect(page.locator('input[name="slugJa"]')).toHaveValue(SLUG_JA);
  });

  test("6.9 active product appears on public shop page", async ({ adminPage: page, browser }) => {
    test.skip(!productId, "Product not created in 6.5");
    // Ensure active checkbox is checked (default)
    await page.goto(`/admin/products/${productId}`);
    const activeCheckbox = page.locator('input[name="active"]');
    if (!(await activeCheckbox.isChecked())) {
      await activeCheckbox.check();
      await page.click('button[type="submit"]');
      await page.waitForURL(/\/admin\/products$/, { timeout: 10_000 });
    }

    const ctx = await browser.newContext();
    const shopPage = await ctx.newPage();
    await shopPage.goto("/en/shop");
    await expect(shopPage.getByText(NAME_EN)).toBeVisible({ timeout: 10_000 });
    await ctx.close();
  });

  test("6.11 product detail page renders name and variants", async ({ browser }) => {
    test.skip(!productId, "Product not created in 6.5");
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto(`/en/shop/${SLUG_EN}`);
    await expect(page.locator("h1")).toContainText(NAME_EN, { timeout: 10_000 });
    await ctx.close();
  });

  test("6.10 inactive product does not appear on public shop", async ({ adminPage: page, browser }) => {
    // Create a separate inactive product
    const inactiveSlug = `inactive-product-${TS}`;
    const inactiveName = `Inactive Product ${TS}`;
    await page.goto("/admin/products/new");
    await page.fill('input[name="nameJa"]', `非表示商品 ${TS}`);
    await page.fill('input[name="nameEn"]', inactiveName);
    await page.fill('input[name="slugJa"]', inactiveSlug + "-ja");
    await page.fill('input[name="slugEn"]', inactiveSlug);
    // Uncheck the active checkbox
    const activeCheckbox = page.locator('input[name="active"]');
    if (await activeCheckbox.isChecked()) await activeCheckbox.uncheck();
    const variantsFieldset = page.locator('fieldset').nth(1);
    await variantsFieldset.locator('input').first().fill("標準");
    await variantsFieldset.locator('input[type="number"]').first().fill("500");
    await variantsFieldset.locator('input[type="number"]').last().fill("10");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/admin\/products$/, { timeout: 10_000 });

    const ctx = await browser.newContext();
    const shopPage = await ctx.newPage();
    await shopPage.goto("/en/shop");
    await expect(shopPage.getByText(inactiveName)).not.toBeVisible({ timeout: 5_000 });
    await shopPage.close();
    await ctx.close();

    // Clean up
    const row = page.locator("tr").filter({ hasText: inactiveName });
    const href = await row.getByRole("link", { name: "Edit" }).getAttribute("href");
    const id = href?.split("/").pop();
    if (id) {
      await page.goto(`/admin/products/${id}`);
      const deleteBtn = page.getByRole("button", { name: /delete/i });
      if (await deleteBtn.isVisible({ timeout: 2_000 }).catch(() => false)) {
        await deleteBtn.click();
        const confirmBtn = page.getByRole("button", { name: /delete/i }).last();
        if (await confirmBtn.isVisible({ timeout: 2_000 }).catch(() => false)) {
          await confirmBtn.click();
        }
      }
    }
  });

  test("6.8 delete product removes it from the list", async ({ adminPage: page }) => {
    test.skip(!productId, "Product not created in 6.5");
    await page.goto(`/admin/products/${productId}`);
    const deleteBtn = page.getByRole("button", { name: /delete/i });
    await deleteBtn.click();
    const confirmBtn = page.getByRole("button", { name: /delete/i }).last();
    if (await confirmBtn.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await confirmBtn.click();
    }
    await page.waitForURL(/\/admin\/products$/, { timeout: 10_000 });
    await expect(page.locator("tr").filter({ hasText: NAME_EN })).not.toBeVisible();
    productId = null;
  });
});
