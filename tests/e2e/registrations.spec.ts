/**
 * Tests: 5.7 – 5.8  Event Registrations (public form)
 *
 * Creates a published event in beforeAll, tests registration against it,
 * then deletes it in afterAll.
 */
import { test, expect } from "./fixtures";

const TS = Date.now();
const SLUG_JA = `reg-test-ja-${TS}`;
const SLUG_EN = `reg-test-en-${TS}`;
const TITLE_JA = `登録テスト ${TS}`;
const TITLE_EN = `Registration Test Event ${TS}`;
const STARTS = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16);
const ENDS = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000)
  .toISOString()
  .slice(0, 16);

let testEventId: string | null = null;

test.beforeAll(async ({ browser }) => {
  const context = await browser.newContext({
    storageState: "tests/e2e/.auth/admin.json",
  });
  await context.addCookies([{ name: "admin-locale", value: "en", domain: "localhost", path: "/" }]);
  const page = await context.newPage();

  await page.goto("/admin/events/new");
  await page.fill('input[name="titleJa"]', TITLE_JA);
  await page.fill('input[name="titleEn"]', TITLE_EN);
  await page.fill('input[name="slugJa"]', SLUG_JA);
  await page.fill('input[name="slugEn"]', SLUG_EN);
  await page.fill('input[name="startsAt"]', STARTS);
  await page.fill('input[name="endsAt"]', ENDS);
  await page.selectOption('select[name="status"]', "PUBLISHED");
  await page.selectOption('select[name="mode"]', "ONLINE");
  await page.selectOption('select[name="priceType"]', "FREE");
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/admin\/events$/, { timeout: 10_000 });

  // admin-locale=en is set so list displays TITLE_EN
  const row = page.locator("tr").filter({ hasText: TITLE_EN });
  const href = await row.getByRole("link", { name: "Edit" }).getAttribute("href");
  testEventId = href?.split("/").pop() ?? null;
  await context.close();
});

test.afterAll(async ({ browser }) => {
  if (!testEventId) return;
  const context = await browser.newContext({
    storageState: "tests/e2e/.auth/admin.json",
  });
  const page = await context.newPage();
  await page.goto(`/admin/events/${testEventId}`);
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

test.describe("Event Registrations – public form", () => {
  test("5.7 registration form submits successfully", async ({ browser }) => {
    test.skip(!testEventId, "Test event was not created");
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto(`/en/events/${SLUG_EN}`);

    // Fill registration form — inputs are React state-controlled (no name attrs)
    // First email input in the form is the main contact email
    await page.locator('form input[type="email"]').first().fill("playwright-test@example.com");
    // First input in the attendee card is nameJa
    await page.locator('div.rounded-md.border input').first().fill("テスト太郎");

    await page.getByRole("button", { name: /register|submit|申し込む/i }).click();

    // Should show success message or confirmation
    await expect(
      page.getByText(/confirmed|registered|success|完了|確認/i)
    ).toBeVisible({ timeout: 10_000 });
    await ctx.close();
  });

  test("5.8 missing required fields shows validation errors", async ({ browser }) => {
    test.skip(!testEventId, "Test event was not created");
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto(`/en/events/${SLUG_EN}`);

    // Submit without filling anything
    await page.getByRole("button", { name: /register|submit|申し込む/i }).click();

    // Browser native validation or custom error should appear
    // Either the form won't submit (native required), or we get an error message
    const emailInput = page.locator('form input[type="email"]').first();
    const isInvalid = await emailInput.evaluate(
      (el: HTMLInputElement) => !el.validity.valid
    );
    expect(isInvalid || await page.getByRole("alert").isVisible().catch(() => false)).toBeTruthy();
    await ctx.close();
  });
});
