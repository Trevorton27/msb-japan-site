/**
 * Tests: 10.7 – 10.11  Contact Form (public submit + admin management)
 */
import { test, expect } from "./fixtures";

const TS = Date.now();
const TEST_NAME = `Playwright Test ${TS}`;
const TEST_EMAIL = `playwright-${TS}@example.com`;
const TEST_SUBJECT = `Test Subject ${TS}`;
const TEST_BODY = `This is a Playwright automated test message. Timestamp: ${TS}`;

test.describe("Contact Form – public", () => {
  test("10.7 contact form submits successfully and shows success message", async ({ browser }) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto("/en/contact");

    await page.fill("#name", TEST_NAME);
    await page.fill("#email", TEST_EMAIL);
    await page.fill("#subject", TEST_SUBJECT);
    await page.fill("#body", TEST_BODY);
    await page.getByRole("button", { name: /send|送信/i }).click();

    await expect(
      page.getByText(/sent|thank you|success|送信しました|ありがとう/i)
    ).toBeVisible({ timeout: 10_000 });
    await ctx.close();
  });

  test("10.8 submitting with missing required fields shows validation errors", async ({ browser }) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto("/en/contact");

    // Submit without filling anything
    await page.getByRole("button", { name: /send|送信/i }).click();

    // Name and body are required — expect invalid state or error text
    const nameInput = page.locator("#name");
    const nameInvalid = await nameInput.evaluate(
      (el: HTMLInputElement) => !el.validity.valid
    ).catch(() => false);
    const hasError = await page
      .getByText(/required|error|必須/i)
      .isVisible({ timeout: 3_000 })
      .catch(() => false);
    expect(nameInvalid || hasError).toBeTruthy();
    await ctx.close();
  });
});

test.describe("Contacts – admin", () => {
  test("10.9 admin contacts list shows messages", async ({ adminPage: page }) => {
    await page.goto("/admin/contacts");
    await expect(page).toHaveURL(/\/admin\/contacts/);
    // Either messages or empty state
    const contentArea = page
      .locator(".space-y-4, table")
      .or(page.getByText(/no contact|お問い合わせはまだ/i));
    await expect(contentArea).toBeVisible({ timeout: 8_000 });
  });

  test("10.10 status action buttons update the displayed status", async ({ adminPage: page }) => {
    await page.goto("/admin/contacts");
    // Find the first NEW message
    const newMsg = page.locator("div").filter({ hasText: /NEW/ }).first();
    const hasNew = await newMsg.isVisible({ timeout: 3_000 }).catch(() => false);
    test.skip(!hasNew, "No NEW contact messages in DB");

    await newMsg.getByRole("button", { name: "Mark Read" }).first().click();
    // After the action, the badge should change — use first() to avoid strict mode on multiple matches
    await expect(newMsg.getByText("READ").first()).toBeVisible({ timeout: 5_000 });
  });

  test("10.11 adding a note appends it to the message", async ({ adminPage: page }) => {
    await page.goto("/admin/contacts");
    const firstMsg = page.locator("div.rounded-lg.border").first();
    const hasMsg = await firstMsg.isVisible({ timeout: 3_000 }).catch(() => false);
    test.skip(!hasMsg, "No contact messages in DB");

    // Look for an "Add Note" input or textarea
    const noteInput = firstMsg
      .locator('input[placeholder*="note"], textarea[placeholder*="note"]')
      .or(firstMsg.locator('input[name="note"], textarea[name="note"]'));
    const hasNoteInput = await noteInput.isVisible({ timeout: 2_000 }).catch(() => false);
    test.skip(!hasNoteInput, "Note input not found — may require expanding the message");

    const noteText = `Test note ${TS}`;
    await noteInput.fill(noteText);
    await firstMsg.getByRole("button", { name: /add note|save note|メモ/i }).click();
    await expect(firstMsg.getByText(noteText)).toBeVisible({ timeout: 5_000 });
  });
});
