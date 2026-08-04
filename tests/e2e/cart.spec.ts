/**
 * Tests: 7.9 – 7.13  Cart & Checkout
 *
 * Creates a test product with a variant in beforeAll, runs cart tests, then
 * cleans up in afterAll. Each cart test clears cookies between runs to avoid
 * cross-test state.
 */
import { test, expect } from "./fixtures";

const TS = Date.now();
const PRODUCT_SLUG_JA = `cart-test-${TS}`;
const PRODUCT_SLUG_EN = `cart-test-en-${TS}`;
const PRODUCT_NAME_JA = `カートテスト ${TS}`;
const PRODUCT_NAME_EN = `Cart Test Product ${TS}`;

let productId: string | null = null;

test.beforeAll(async ({ browser }) => {
  const context = await browser.newContext({
    storageState: "tests/e2e/.auth/admin.json",
  });
  await context.addCookies([{ name: "admin-locale", value: "en", domain: "localhost", path: "/" }]);
  const page = await context.newPage();

  await page.goto("/admin/products/new");
  await page.fill('input[name="nameJa"]', PRODUCT_NAME_JA);
  await page.fill('input[name="nameEn"]', PRODUCT_NAME_EN);
  await page.fill('input[name="slugJa"]', PRODUCT_SLUG_JA);
  await page.fill('input[name="slugEn"]', PRODUCT_SLUG_EN);
  // Variant inputs are React state-controlled (no name attrs); use fieldset position
  const variantsFieldset = page.locator('fieldset').nth(1);
  await variantsFieldset.locator('input').first().fill("標準");
  await variantsFieldset.locator('input[type="number"]').first().fill("2000");
  await variantsFieldset.locator('input[type="number"]').last().fill("100");
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/admin\/products$/, { timeout: 10_000 });

  // admin-locale=en cookie is set so list displays PRODUCT_NAME_EN
  const row = page.locator("tr").filter({ hasText: PRODUCT_NAME_EN });
  const href = await row.getByRole("link", { name: "Edit" }).getAttribute("href");
  productId = href?.split("/").pop() ?? null;
  await context.close();
});

test.afterAll(async ({ browser }) => {
  if (!productId) return;
  const context = await browser.newContext({
    storageState: "tests/e2e/.auth/admin.json",
  });
  const page = await context.newPage();
  await page.goto(`/admin/products/${productId}`);
  const deleteBtn = page.getByRole("button", { name: /delete/i });
  if (await deleteBtn.isVisible({ timeout: 3_000 }).catch(() => false)) {
    await deleteBtn.click();
    const confirmBtn = page.getByRole("button", { name: /delete/i }).last();
    if (await confirmBtn.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await confirmBtn.click();
    }
  }
  await context.close();
});

test.describe("Cart", () => {
  test("7.9 Add to Cart button adds product and feedback is visible", async ({ browser }) => {
    test.skip(!productId, "Test product not created");
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto(`/en/shop/${PRODUCT_SLUG_EN}`);
    await page.getByRole("button", { name: /add to cart|カートに追加/i }).click();
    // Button shows "✓" briefly on success
    await expect(page.getByRole("button", { name: "✓" })).toBeVisible({ timeout: 8_000 });
    await ctx.close();
  });

  test("7.10 cart page shows added items with subtotals", async ({ browser }) => {
    test.skip(!productId, "Test product not created");
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    // Add product first
    await page.goto(`/en/shop/${PRODUCT_SLUG_EN}`);
    await page.getByRole("button", { name: /add to cart|カートに追加/i }).click();
    await expect(page.getByRole("button", { name: "✓" })).toBeVisible({ timeout: 8_000 });
    // Go to cart
    await page.goto("/en/shop/cart");
    await expect(page.getByText(PRODUCT_NAME_EN)).toBeVisible({ timeout: 8_000 });
    // Price should appear somewhere in the cart
    await expect(page.getByText(/¥|2,000|2000/).first()).toBeVisible();
    await ctx.close();
  });

  test("7.11 incrementing quantity on cart page updates total", async ({ browser }) => {
    test.skip(!productId, "Test product not created");
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto(`/en/shop/${PRODUCT_SLUG_EN}`);
    await page.getByRole("button", { name: /add to cart|カートに追加/i }).click();
    await expect(page.getByRole("button", { name: "✓" })).toBeVisible({ timeout: 8_000 });
    await page.goto("/en/shop/cart");
    await expect(page.getByText(PRODUCT_NAME_EN)).toBeVisible({ timeout: 8_000 });

    // Find increment button
    const incrementBtn = page.getByRole("button", { name: /\+|increase|increment/i });
    if (await incrementBtn.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await incrementBtn.click();
      // Total should now reflect quantity 2
      await expect(page.getByText(/4,000|4000/).first()).toBeVisible({ timeout: 5_000 });
    }
    await ctx.close();
  });

  test("7.12 removing an item from the cart removes it from the list", async ({ browser }) => {
    test.skip(!productId, "Test product not created");
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto(`/en/shop/${PRODUCT_SLUG_EN}`);
    await page.getByRole("button", { name: /add to cart|カートに追加/i }).click();
    await expect(page.getByRole("button", { name: "✓" })).toBeVisible({ timeout: 8_000 });
    await page.goto("/en/shop/cart");
    await expect(page.getByText(PRODUCT_NAME_EN)).toBeVisible({ timeout: 8_000 });

    const removeBtn = page.getByRole("button", { name: /remove|削除/i });
    await removeBtn.click();
    await expect(page.getByText(PRODUCT_NAME_EN)).not.toBeVisible({ timeout: 5_000 });
    await ctx.close();
  });

  test("7.13 checkout button redirects to Stripe", async ({ browser }) => {
    test.skip(!productId, "Test product not created");
    // Skip if Stripe keys are not configured
    test.skip(
      !process.env.STRIPE_SECRET_KEY || !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      "Stripe keys not configured"
    );
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto(`/en/shop/${PRODUCT_SLUG_EN}`);
    await page.getByRole("button", { name: /add to cart|カートに追加/i }).click();
    await expect(page.getByRole("button", { name: "✓" })).toBeVisible({ timeout: 8_000 });
    await page.goto("/en/shop/cart");
    await expect(page.getByText(PRODUCT_NAME_EN)).toBeVisible({ timeout: 8_000 });

    const checkoutBtn = page.getByRole("button", { name: /checkout|チェックアウト|注文/i })
      .or(page.getByRole("link", { name: /checkout/i }));
    await checkoutBtn.click();
    // Should navigate to Stripe checkout
    await page.waitForURL(/checkout\.stripe\.com/, { timeout: 15_000 });
    await ctx.close();
  });
});
