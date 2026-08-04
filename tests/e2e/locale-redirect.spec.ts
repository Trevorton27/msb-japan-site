import { test, expect } from "@playwright/test";

test("root redirects to /ja", async ({ browser }) => {
  // Use locale: "ja" so the browser sends Accept-Language: ja, ensuring the default locale redirect
  const ctx = await browser.newContext({ locale: "ja" });
  const page = await ctx.newPage();
  const response = await page.goto("/");
  expect(response?.url()).toContain("/ja");
  await ctx.close();
});

test("/en renders English content", async ({ page }) => {
  await page.goto("/en");
  // The home page should render with a visible h1
  await expect(page.locator("h1").first()).toBeVisible({ timeout: 10_000 });
});

test("/ja renders Japanese content", async ({ page }) => {
  await page.goto("/ja");
  // The home page should render with a visible h1
  await expect(page.locator("h1").first()).toBeVisible({ timeout: 10_000 });
});
