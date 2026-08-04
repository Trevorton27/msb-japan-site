/**
 * Tests: 3.10 – 3.16  Content Posts (admin CRUD + public visibility)
 */
import { test, expect } from "./fixtures";

const TS = Date.now();
const SLUG_JA = `test-kyoshi-${TS}`;
const SLUG_EN = `test-teaching-${TS}`;
const TITLE_JA = `テスト教え ${TS}`;
const TITLE_EN = `Test Teaching ${TS}`;

async function fillContentForm(
  page: import("@playwright/test").Page,
  opts: { titleJa: string; titleEn: string; slugJa: string; slugEn: string; status: string }
) {
  await page.fill("#titleJa", opts.titleJa);
  await page.fill("#titleEn", opts.titleEn);
  await page.fill("#slugJa", opts.slugJa);
  await page.fill("#slugEn", opts.slugEn);
  await page.selectOption('select[name="type"]', "TEACHING");
  await page.selectOption('select[name="status"]', opts.status);
}

test.describe("Content CRUD", () => {
  let postId: string | null = null;

  test("3.10 create post via admin form – appears in list", async ({ adminPage: page }) => {
    await page.goto("/admin/content/new");
    await fillContentForm(page, {
      titleJa: TITLE_JA,
      titleEn: TITLE_EN,
      slugJa: SLUG_JA,
      slugEn: SLUG_EN,
      status: "DRAFT",
    });
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/admin\/content$/, { timeout: 10_000 });

    // admin-locale=en is set by fixture, so list displays TITLE_EN
    const row = page.locator("tr").filter({ hasText: TITLE_EN });
    await expect(row).toBeVisible();
    // Capture the edit link href to derive the post ID for later tests
    const editLink = row.getByRole("link", { name: "Edit" });
    const href = await editLink.getAttribute("href");
    postId = href?.split("/").pop() ?? null;
  });

  test("3.11 edit form pre-populates all fields correctly", async ({ adminPage: page }) => {
    test.skip(!postId, "Post was not created in 3.10");
    await page.goto(`/admin/content/${postId}`);
    await expect(page.locator("#titleJa")).toHaveValue(TITLE_JA);
    await expect(page.locator("#titleEn")).toHaveValue(TITLE_EN);
    await expect(page.locator("#slugJa")).toHaveValue(SLUG_JA);
    await expect(page.locator("#slugEn")).toHaveValue(SLUG_EN);
  });

  test("3.12 status action button updates displayed status", async ({ adminPage: page }) => {
    test.skip(!postId, "Post was not created in 3.10");
    await page.goto(`/admin/content/${postId}`);
    // DRAFT → click "Submit for Review"
    await page.getByRole("button", { name: "Submit for Review" }).click();
    // After server action, the available transitions should reflect REVIEW status
    await expect(page.getByRole("button", { name: "Approve" })).toBeVisible({ timeout: 5_000 });
  });

  test("3.14 published post appears on public teachings page", async ({ adminPage: page, browser }) => {
    test.skip(!postId, "Post was not created in 3.10");
    // Advance to PUBLISHED
    await page.goto(`/admin/content/${postId}`);
    // Approve
    const approveBtn = page.getByRole("button", { name: "Approve" });
    if (await approveBtn.isVisible()) await approveBtn.click();
    // Publish
    const publishBtn = page.getByRole("button", { name: "Publish Now" });
    await expect(publishBtn).toBeVisible({ timeout: 5_000 });
    await publishBtn.click();
    await expect(page.getByRole("button", { name: "Archive" })).toBeVisible({ timeout: 5_000 });

    // Check public page
    const publicCtx = await browser.newContext();
    const publicPage = await publicCtx.newPage();
    await publicPage.goto("/en/teachings");
    await expect(publicPage.getByText(TITLE_EN)).toBeVisible({ timeout: 10_000 });
    await publicCtx.close();
  });

  test("3.16 public teaching slug resolves to correct locale content", async ({ browser }) => {
    test.skip(!postId, "Post not created");
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto(`/en/teachings/${SLUG_EN}`);
    await expect(page.locator("h1")).toContainText(TITLE_EN, { timeout: 10_000 });
    await ctx.close();
  });

  test("3.13 delete post removes it from the list", async ({ adminPage: page }) => {
    test.skip(!postId, "Post was not created in 3.10");
    await page.goto(`/admin/content/${postId}`);
    const deleteBtn = page.getByRole("button", { name: /delete/i });
    await deleteBtn.click();
    // Confirm in modal if present
    const confirmBtn = page.getByRole("button", { name: /delete/i }).last();
    if (await confirmBtn.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await confirmBtn.click();
    }
    await page.waitForURL(/\/admin\/content$/, { timeout: 10_000 });
    await expect(page.locator("tr").filter({ hasText: TITLE_EN })).not.toBeVisible();
    postId = null;
  });

  test("3.15 draft post does not appear on public listings", async ({ adminPage: page, browser }) => {
    const draftSlug = `test-draft-${TS}`;
    const draftTitle = `Draft Post ${TS}`;
    // Create a draft
    await page.goto("/admin/content/new");
    await fillContentForm(page, {
      titleJa: `下書きテスト ${TS}`,
      titleEn: draftTitle,
      slugJa: draftSlug + "-ja",
      slugEn: draftSlug,
      status: "DRAFT",
    });
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/admin\/content$/, { timeout: 10_000 });

    // Check public page — should NOT appear
    const publicCtx = await browser.newContext();
    const publicPage = await publicCtx.newPage();
    await publicPage.goto("/en/teachings");
    await expect(publicPage.getByText(draftTitle)).not.toBeVisible({ timeout: 5_000 });
    await publicCtx.close();

    // Clean up
    const row = page.locator("tr").filter({ hasText: draftTitle });
    const editHref = await row.getByRole("link", { name: "Edit" }).getAttribute("href");
    const id = editHref?.split("/").pop();
    if (id) {
      await page.goto(`/admin/content/${id}`);
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
});
