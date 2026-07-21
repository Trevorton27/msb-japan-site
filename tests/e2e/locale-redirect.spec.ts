import { test, expect } from "@playwright/test";

test("root redirects to /ja", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.url()).toContain("/ja");
});

test("/en renders English content", async ({ page }) => {
  await page.goto("/en");
  await expect(page.locator("h1")).toContainText("Mangala Shri Bhuti Japan");
});

test("/ja renders Japanese content", async ({ page }) => {
  await page.goto("/ja");
  await expect(page.locator("h1")).toContainText("Mangala Shri Bhuti Japan");
});
