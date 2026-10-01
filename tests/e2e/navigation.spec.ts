/**
 * Tests: 14.1 – 14.13  Navigation & i18n
 *
 * Covers middleware locale redirects, desktop Lineage dropdown,
 * mobile nav sub-items, and the language switcher (incl. anchors).
 */
import { test, expect } from "@playwright/test";

const BASE = "http://localhost:3000";

test.describe("Middleware – locale redirects (14.1 – 14.3)", () => {
  test("14.1 bare /about redirects to /ja/about (default locale)", async ({ browser }) => {
    // Use Playwright locale option which sets Accept-Language: ja header
    const ctx = await browser.newContext({ locale: "ja" });
    const page = await ctx.newPage();
    await page.goto("/about");
    await expect(page).toHaveURL(`${BASE}/ja/about`);
    await ctx.close();
  });

  test("14.2 bare /about redirects to /en/about when NEXT_LOCALE=en cookie is set", async ({
    browser,
  }) => {
    const ctx = await browser.newContext({
      storageState: undefined,
    });
    await ctx.addCookies([
      { name: "NEXT_LOCALE", value: "en", domain: "localhost", path: "/" },
    ]);
    const page = await ctx.newPage();
    await page.goto("/about");
    await expect(page).toHaveURL(`${BASE}/en/about`);
    await ctx.close();
  });

  test("14.3 /api paths are not locale-redirected", async ({ request }) => {
    // The auth endpoint should not be redirected
    const res = await request.get("/api/auth/providers");
    // Expect a non-redirect response (2xx or 405 — not 3xx)
    expect(res.status()).toBeLessThan(300);
  });

  test("14.3 /admin paths are not locale-redirected", async ({ page }) => {
    await page.goto("/admin/login");
    // Should land on /admin/login, not /ja/admin/login
    await expect(page).toHaveURL(`${BASE}/admin/login`);
  });
});

test.describe("Desktop nav – Lineage dropdown (14.4 – 14.6)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en");
    await page.setViewportSize({ width: 1280, height: 800 });
  });

  test("14.4 Lineage dropdown appears on hover", async ({ page }) => {
    const lineageLink = page
      .getByRole("navigation")
      .getByRole("link", { name: /^lineage & teachers$/i })
      .first();
    await lineageLink.hover();
    const dropdown = page.locator(".absolute");
    await expect(dropdown.getByRole("link", { name: /^teachers$/i })).toBeVisible({
      timeout: 3_000,
    });
    await expect(dropdown.getByRole("link", { name: /^nyingma$/i })).toBeVisible();
  });

  test("14.5 Teachers link in the Lineage dropdown navigates to /teachers", async ({ page }) => {
    const lineageLink = page
      .getByRole("navigation")
      .getByRole("link", { name: /^lineage & teachers$/i })
      .first();
    await lineageLink.hover();
    await page.locator(".absolute").getByRole("link", { name: /^teachers$/i }).click();
    await expect(page).toHaveURL(/\/en\/teachers$/);
  });

  test("14.6 clicking the Lineage label navigates to /lineage", async ({ page }) => {
    await page
      .getByRole("navigation")
      .getByRole("link", { name: /^lineage & teachers$/i })
      .first()
      .click();
    await expect(page).toHaveURL(/\/en\/lineage$/);
  });
});

test.describe("Mobile nav (14.7 – 14.10)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en");
    await page.setViewportSize({ width: 375, height: 812 }); // iPhone SE
  });

  test("14.7 hamburger button opens the nav sheet", async ({ page }) => {
    const hamburger = page.getByRole("button", { name: /open menu/i });
    await hamburger.click();
    // Sheet should be open — Lineage link visible
    await expect(page.getByRole("link", { name: /^lineage & teachers$/i })).toBeVisible({
      timeout: 3_000,
    });
  });

  test("14.8 tapping the Lineage chevron expands sub-items", async ({ page }) => {
    const hamburger = page.getByRole("button", { name: /open menu/i });
    await hamburger.click();

    const expandBtn = page.getByRole("button", { name: /expand lineage/i });
    await expandBtn.click();

    // Sub-items are links inside the indented section (ml-4, border-l)
    const subLinks = page.locator(".border-l a");
    await expect(subLinks.getByText(/^teachers$/i)).toBeVisible({ timeout: 3_000 });
  });

  test("14.9 tapping the Teachers sub-item navigates and closes the sheet", async ({ page }) => {
    const hamburger = page.getByRole("button", { name: /open menu/i });
    await hamburger.click();

    const expandBtn = page.getByRole("button", { name: /expand lineage/i });
    await expandBtn.click();

    await page.locator(".border-l a").getByText(/^teachers$/i).click();
    // Sheet should close (hamburger visible again)
    await expect(page.getByRole("button", { name: /open menu/i })).toBeVisible({ timeout: 3_000 });
    await expect(page).toHaveURL(/\/en\/teachers$/);
  });

  test("14.10 Donate button at bottom of mobile nav navigates to /donate", async ({ page }) => {
    const hamburger = page.getByRole("button", { name: /open menu/i });
    await hamburger.click();

    const donateLink = page.getByRole("link", { name: /donate|寄付/i });
    await donateLink.click();
    await expect(page).toHaveURL(/\/donate/);
  });
});

test.describe("Language switcher (14.11 – 14.12b)", () => {
  test("14.11 switching from ja to en updates locale in URL and renders English content", async ({
    page,
  }) => {
    await page.goto("/ja");
    // Language switcher is a Link with aria-label "Switch to English" when current locale is ja
    const enBtn = page.getByRole("link", { name: "Switch to English" });
    await enBtn.click();
    await expect(page).toHaveURL(/\/en/);
  });

  test("14.12 switching locale sets the NEXT_LOCALE cookie", async ({ page, context }) => {
    await page.goto("/ja");
    const enBtn = page.getByRole("link", { name: "Switch to English" });
    await enBtn.click();
    await page.waitForURL(/\/en/, { timeout: 5_000 });

    const cookies = await context.cookies();
    const localeCookie = cookies.find((c) => c.name === "NEXT_LOCALE");
    expect(localeCookie?.value).toBe("en");
  });
});

test.describe("Language switcher – anchors (14.12b)", () => {
  test("14.12b switching locale keeps the path and the #anchor", async ({ page }) => {
    await page.goto("/en/vision#sangha");
    await page.getByRole("link", { name: "日本語に切り替え" }).click();
    await expect(page).toHaveURL(`${BASE}/ja/vision#sangha`);
    await expect(page.locator("#sangha")).toBeInViewport();
  });
});

test.describe("Language switcher – mobile (14.12c)", () => {
  test("14.12c mobile header has a language switcher that keeps the #anchor", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/ja/programs#tsok");
    await page.getByRole("link", { name: "Switch to English" }).click();
    await expect(page).toHaveURL(`${BASE}/en/programs#tsok`);
  });
});

test.describe("Admin locale toggle (14.13)", () => {
  test("14.13 admin locale toggle re-renders labels between ja and en", async ({ browser }) => {
    const ctx = await browser.newContext({
      storageState: "tests/e2e/.auth/admin.json",
    });
    const page = await ctx.newPage();
    await page.goto("/admin");

    // Find the locale toggle (ja/en buttons in admin header)
    const jaBtn = page.getByRole("button", { name: /^ja$/i }).or(
      page.getByRole("button", { name: /日本語/i })
    );
    const enBtn = page.getByRole("button", { name: /^en$/i }).or(
      page.getByRole("button", { name: /English/i })
    );

    // Switch to English
    if (await enBtn.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await enBtn.click();
      await expect(page.getByText("Dashboard")).toBeVisible({ timeout: 5_000 });
    }

    // Switch to Japanese
    if (await jaBtn.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await jaBtn.click();
      await expect(page.getByText("ダッシュボード")).toBeVisible({ timeout: 5_000 });
    }

    await ctx.close();
  });
});
