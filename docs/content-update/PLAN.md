# MSBJ Site Content Update — Outline v11

**Goal:** Replace the public site's text content with the approved bilingual copy in
`docs/content-update/source-outline-v11.txt`, and reorganize navigation to match the outline's 10 sections.
Japanese renders only on `/ja/...` and English only on `/en/...`, following the visitor's language selection.

**Source of truth:** `source-outline-v11.txt` comes from `260915oka_website_outline_v8_JP_v11_1_.docx` with all
gray-shaded text removed. Gray-shaded text was deliberately excluded and must not be reintroduced from the original .docx.
`content-source.json` is the same text parsed into sections, with each Japanese run paired with its English run.
Use it as your working copy, but treat the .txt file as authoritative whenever the two disagree.

---

## 0. Working protocol for Claude Code

Read this whole file before writing any code. Then:

1. **Work one phase at a time.** Finish a phase, run its checks, commit, then **stop and summarize** what changed
   and which open decisions you hit. Do not start the next phase until the user confirms.
2. **Copy text verbatim.** Copy every string character for character from `content-source.json`.
   - Do not paraphrase, "improve," re-translate, or fix grammar.
   - If something looks wrong, add it to the phase summary and leave the source text unchanged.
3. **Never render editorial notes.** Anything under `editorialNotes`, plus inline markers, is guidance for the builder, not site copy. This includes:
   - ［EN: …］ tags, ※ notes, サブメニュー lists, 例） examples, （新設） / (New), → ボタン, and 導入.
4. **Use a separate store per language.** Never put JA and EN in the same string or the same render path. See §2.
5. **Run the coverage check after every content phase:** `node scripts/check-content-coverage.mjs`
   (or `--section <id>`). A line that is deliberately not rendered goes into `coverage-ignore.json` with a reason.
   The goal is zero `missing` and zero `partial` lines.
6. **Run the gates before every commit:**
   - `pnpm lint`
   - `pnpm tsc --noEmit`
   - `pnpm test`
   - For phases that touch navigation, also run `pnpm test:e2e tests/e2e/navigation.spec.ts`.
7. **Ask before destroying anything.** Don't delete routes, DB rows, or seed entries without asking. Prefer redirects (the `Redirect` model and `/admin/redirects`) over removal.
8. **Keep production data safe.** Never run `pnpm db:seed` against production. To change DB content, write a targeted, idempotent script (see Phase 4).
9. **Check Next.js docs first.** This project runs Next 16. Before using any API you're unsure of, read `node_modules/next/dist/docs/` (this was the rule in the deleted `AGENTS.md`; see Phase 0).

### Recommended models
- **Phase 1 (IA and navigation) and Phase 4 (DB content and rendering):** Opus 5.5. These involve cross-cutting decisions, a schema-adjacent rendering change, and tests.
- **Phases 2, 3 and 5:** Sonnet 5.5 is fine. They're mostly verbatim content transfer against a fixed source with an automated checker.
- **Final review:** If you used Sonnet for a phase, do a final Opus pass over the diff and the coverage report.

---

## 1. Inventory: how content is stored today

The site mixes three content-storage patterns. Keep each page on the pattern it already uses unless this plan says otherwise.

| Pattern | Where | Used by |
|---|---|---|
| UI dictionaries | `src/dictionaries/{ja,en}.json` (386 keys each, in parity) | home, about, centres, programs, gatherings, life-release, donate, contact, events, nav (`common.*`), footer |
| Inline per-page `content = { ja: {...}, en: {...} }` | inside `page.tsx` | `vision`, `history`, parts of `teachings`, `videos` |
| Database, with `*Ja`/`*En` field pairs and seeding from `prisma/seed-data/legacy-content.ts` | Prisma | teachers (`Teacher.bioJa/bioEn`), events, centers, content posts (`msbj-link`, `dharma-article`, `video-howa`, `keifu`…) |

**Rule for new long-form pages** (lineage pages, organization overview): use the inline pattern that `vision/page.tsx`
already uses, but type it so JA/EN parity is enforced at compile time:

```ts
type PageContent = { title: string; sections: { id: string; heading: string; paragraphs: string[]; quote?: { text: string; source?: string } }[] };
const content = { ja: {...}, en: {...} } satisfies Record<Locale, PageContent>;
```

- Use the same section `id`s in both locales. Anchors must not depend on the locale, so `/ja/x#sangha` and `/en/x#sangha` both work and the language switcher keeps the anchor.
- Short labels shared across pages (nav, buttons, footer) go in the dictionaries.

---

## 2. Language display rules

- **Pick by locale.** Each component chooses its text from the route locale only: `dict` from `getDictionary(locale)`, `content[locale]`, or the DB field for that locale. Nothing renders both languages side by side.
- **No English in JA labels.** Strip the English parentheticals from the outline headings. For example, the nav shows 「ホーム」, not 「ホーム（Home）」. On `/en`, use the English line that follows the heading.
- **Fallback.** For DB fields only, keep the existing pattern of falling back to JA when EN is empty. Static content must have both languages, and the `satisfies` type plus the checker enforce this.
- **Metadata.** Set `<title>` and description per locale for every page you touch or create.
- **Attribution style follows the source for each language.** JA uses 「…」 and ――; EN uses “…” and an em dash or caps attribution exactly as given.
- **Paragraphs.** Split multi-paragraph text into arrays or `\n\n`, and render each paragraph as its own `<p>`. Today `teachers/page.tsx` renders `bio` in a single `<p>`, which collapses paragraph breaks (fixed in Phase 4).

---

## 3. Outline → site mapping

The section IDs match `content-source.json` and the coverage check.

| Outline | Route(s) | Storage | Action |
|---|---|---|---|
| 1 ホーム / Home | `/` | `dict.home`, plus events and centers from the DB | Replace hero quote, Programs & Activities intro and list, Teachings & Resources intro and list, Our Centers labels, 3 banners, Support, Newsletter. The 例） event is a sample: keep events dynamic. |
| 2 MSBJについて / About Us | `/about` | `dict.about` | Rebuild as the About landing page with the outline's sub-sections, linking to the subpages below. |
| 2 › Vision, Sangha | `/vision#vision`, `/vision#sangha` | inline `content` | Replace text. |
| 2-1 日本のビジョン / Vision for Japan | `/vision#japan` | inline `content` | Replace text. The outline condenses the existing interview into new paragraphs; replace the old ones rather than merging them. |
| 2 › Our Centers | `/centres#kyoto`, `/centres#izu` | `dict.centres` + inline `centres` | Replace descriptions, and also update the matching DB `DharmaCenter` rows if the home page reads from them. |
| 2 › Support & Donations | `/donate` | `dict.donate` | Use the outline sentence as the intro. |
| 2 › Organization Overview | `/organization-info` | currently a placeholder | New inline content. The 「法人概要・沿革はこちら」 link goes to `/history` (open decision D4). |
| 3 法脈 / Lineage & Teachers | `/lineage` (new) | inline | New landing page with the intro quote and paragraph, linking to 3-1 through 3-5. |
| 3-1 指導者 / Teachers | `/teachers` | DB `Teacher` | Replace the bios for Dzigar Kongtrul Rinpoche, Dilgo Khyentse Rinpoche, and Dungse Jampal Norbu, including the quotes and the letter (Phase 4). |
| 3-2 仏教とは | `/lineage/buddhism` (new) | inline | New page. |
| 3-3 チベット仏教 | `/lineage/tibetan-buddhism` (new) | inline | New page. |
| 3-4 ニンマ派 | `/lineage/nyingma` (new) | inline | New page. The EN is a new translation that needs native review (D2). |
| 3-5 ロンチェン・ニンティク系譜 | `/lineage/longchen-nyingtik` (new) | inline | New page. The EN comes from MSB and must be used as-is. |
| 4 プログラム / Programs | `/programs` | `dict.programs` | Rebuild as one page with anchors: `#teachings-retreats`, `#in-person`, `#online-lineage-course`, `#tsok`, `#compassionate-activity`. The life-release section links to `/life-release`. Add the 志 amount (¥2,000) there. |
| 5 学習リソース / Resources | `/teachings/msbj-link`, `/blog`, `/videos` | content-post excerpts and bodies, list-page intros | Update intros. Skip Guided Meditations (no content yet, D6). |
| 6 ストア・出版物 | `/shop` | — | Nav label only; no copy in the outline. |
| 7 スケジュール / Calendar | `/events` | `dict.events` | Replace the page description. Nav label becomes スケジュール / Calendar. |
| 8 ご寄付 / Donate | `/donate` | `dict.donate` | Title 「寄付のお願い」 / "Support Our Activities", plus the intro sentence. |
| 9 会員ポータル | `/members` | — | Nav label only. Out of scope. |
| 10 お問い合わせ / Contact | `/contact` | `dict.contact` | Nav label only. The outline text 「お問い合わせ先。」 is a placeholder, so keep the existing copy. |
| フッター / Footer | footer | `dict.footer` | Labels: 団体概要/Organization Overview, 定款・規約/Bylaws, プライバシーポリシー/Privacy Policy, MSB本部サイト（米国）/MSB Headquarters Site (U.S.). Use the labels only and drop the parenthetical notes. |

**Existing pages not in the outline:**
- `start`, `gatherings`, `member-programs`, `prayer-requests`, `history`, `tokushoho`, `bylaws`, `privacy`
- the `keifu` / "Lineage" content post

Leave these routes working. Remove them from the main nav only when an outline section replaces them, and add a redirect when content has moved. For example, `keifu` → `/lineage` and `gatherings` → `/programs#in-person`. Confirm each case with the user (D7).

---

## 4. Phases

### Phase 0 — Setup (no content changes)
- [ ] Create a branch: `content/outline-v11`.
- [ ] Confirm these files are present:
  - `docs/content-update/{PLAN.md, source-outline-v11.txt, content-source.json, coverage-ignore.json}`
  - `scripts/check-content-coverage.mjs`
- [ ] Restore `AGENTS.md`. `CLAUDE.md` contains only `@AGENTS.md`, but `AGENTS.md` was deleted in the first commit, so agents currently start with no project rules. Restore the Next.js rule block from commit `379a070` and add a short "Content rules" section with points 2–5 of §0.
- [ ] Run the coverage check and save the baseline output in the phase summary. (Baseline before any changes: 57 ok, 29 partial, 204 missing, 4 ignored.)
- [ ] Commit: `chore: add outline v11 content-update kit`.

### Phase 1 — Information architecture and navigation
- [ ] Rebuild `site-header.tsx`, `mobile-nav.tsx`, and the `common.*` dictionary labels to the 10 outline sections, in outline order, with these submenus:
  - **About:** ビジョン, 日本のビジョン, サンガ, 活動拠点, サポート・寄付, 法人概要
  - **Lineage:** 指導者, 仏教とは, チベット仏教, ニンマ派, ロンチェン・ニンティク系譜
  - **Programs:** use the section headings (see D5)
  - **Resources:** MSBJリンク, ダルマ・アーティクル, ビデオ・音声法話アーカイブ
  - **Labels:** EN labels come from the EN line under each heading.
  - **Existing affordances:** The Donate button and Members link stay as they are; just update their labels.
- [ ] Create the new route stubs (`/lineage`, `/lineage/{buddhism,tibetan-buddhism,nyingma,longchen-nyingtik}`), each with locale metadata and `notFound()` for invalid locales, following existing pages.
- [ ] Update the footer labels.
- [ ] Update `docs/SITE_MAP.md`.
- [ ] Update the e2e navigation tests:
  - `navigation.spec.ts` looks up `/teachers/i` links and an "expand teachers" button.
  - Re-point those selectors to the new structure, and add a test that switches language on a page with an anchor and checks the anchor survives.
- [ ] Run the gates, commit, and stop.

### Phase 2 — Static and dictionary content
- [ ] **Home (section 1).** Update `dict.home.*` in both JSON files. Add keys for the Programs & Activities list and the Teachings & Resources list. Lists are arrays of `{label, text}` in both locales, rendered with "詳しく見る› / Learn more ›" links.
- [ ] **About, Vision, Vision for Japan, Our Centers, Support, Organization Overview (sections 2 and 2-1).**
- [ ] **Programs (section 4)**, plus life-release cross-links.
- [ ] **Calendar (7), Donate (8), resource list-page intros (5).**
- [ ] Keep `ja.json` and `en.json` key sets identical. Add a unit test to `tests/unit/lib/i18n.test.ts` that fails when they diverge.
- [ ] Run the coverage check for sections 1, 2, 2-1, 4, 5, 7, 8 and footer, then the gates. Commit and stop.

### Phase 3 — New lineage pages (sections 3, 3-2 to 3-5)
- [ ] Fill the typed inline content for each page and link the landing page to all five pages, including `/teachers`.
- [ ] Render the reading references ('Masters of Meditation and Miracle', etc.) as given.
- [ ] Add a redirect from the old `keifu` content post to `/lineage` (after the user confirms D7).
- [ ] Run the coverage check for sections 3, 3-2, 3-3, 3-4, 3-5, then the gates. Commit and stop.

### Phase 4 — DB-backed content
- [ ] **Teachers (3-1):**
  - Update `legacyTeachers` in `prisma/seed-data/legacy-content.ts` for the three teachers.
  - Store bios as paragraphs separated by `\n\n`. Mark quotes as blocks, for example a line starting with `> `, and render them as `<blockquote>` with the source line under them. This applies to the Natural Vitality quote, the "Mirror" passages, the letter, and Rinpoche's commentary.
  - Change `teachers/page.tsx` to render paragraphs and quote blocks instead of one `<p>`. Add the `Teacher` subtitle lines (e.g. 「チベット仏教ニンマ派に属するロンチェン・ニンティク系譜の師…」) either as a new optional `taglineJa/taglineEn` field or as the first paragraph. If adding fields needs a migration, ask first.
- [ ] **Event fix:** The `zazenkai-2026-09` seed description says 京都東山 / 裏山の庭, but the outline says 亀岡 / 瞑想ホール. Update the JA and EN descriptions from home lines 13–14.
- [ ] **Centers:** If the home "Our Centers" block reads `DharmaCenter` rows, update their names and descriptions to match section 2's center text.
- [ ] **Resource posts:** Update the excerpts and intro text for the `msbj-link`, `dharma-article`, and `video-howa` posts from section 5.
- [ ] **Production update script:** Write `prisma/scripts/apply-outline-v11.ts`.
  - It must be idempotent, update only the rows listed above (matched by `slugJa`), and support `--dry-run`, which prints a diff.
  - Do not use `pnpm db:seed` in production, because it upserts every content post and would overwrite edits made in the admin.
  - Run it only against the local DB. The user runs it in production.
- [ ] Run the coverage check for section 3-1, then the gates. Commit and stop.

### Phase 5 — QA
- [ ] `node scripts/check-content-coverage.mjs` reports 0 missing and 0 partial lines, with every ignore justified.
- [ ] `pnpm lint && pnpm tsc --noEmit && pnpm test && pnpm test:e2e` all pass.
- [ ] Manually check every outline page in both locales:
  - No editorial markers are visible and no text from the other language leaks through.
  - Quotes and attributions are styled correctly.
  - The language switcher keeps both the path and the anchor.
  - Mobile nav works.
- [ ] Update `docs/content-and-translations-tbd.md` with:
  - the EN items marked 新規英訳・要ネイティブチェック (section 3-4, plus the item tagged after section 1)
  - the open decisions below, and how each was resolved
- [ ] Write a final summary covering pages changed, decisions taken, and anything deferred.

---

## 5. Open decisions and source inconsistencies (resolve with the user)

| # | Issue | Default if no answer |
|---|---|---|
| D1 | **Tsok frequency conflicts.** Home JA says 年次供養行 (annual), home EN says "bimonthly", and Programs says 月に2回 / "Twice a month". | Use the Programs wording (twice a month) on the Programs page, and flag the home lines without changing them. |
| D2 | **EN marked 新規英訳（要ネイティブチェック）** for Nyingma (3-4) and the tag at the end of Home. | Ship the text as written and list it in the TBD doc for review. |
| D3 | **The Lineage intro JA quote 「精神の道とは…」 has no EN translation.** The EN line, "A Spiritual Life in Modern Times", is a title. | Render the EN as a heading, and flag that the quote has no EN. |
| D4 | **Where 「法人概要・沿革はこちら」 should link.** | `/history` |
| D5 | **Programs submenu labels differ from the section headings.** The submenu says 年次法話会・リトリート and オンライン・トレーニング; the headings say 法話会・リトリート and オンライン系譜コース. | Use the section headings for both the submenu and the anchors. |
| D6 | **Guided Meditations (New)** has no content yet (「新規作成予定」). | Don't add a nav item or page yet. |
| D7 | **Existing pages and content outside the outline.** This covers `start`, `gatherings`, `member-programs`, `prayer-requests`, the `keifu` post, and the teacher Elizabeth Mattis Namgyel (in the DB, but not in the outline's teacher list). | Keep them all, remove only from the main nav where replaced, and redirect only after confirmation. |
| D8 | **Privacy Policy is not in the outline** (the outline asks whether it's needed), but `/privacy` exists. | Keep the footer link. |

---

## 6. Out of scope
- Member Portal content (section 9) and anything in `/admin`
- Store product data
- Event schedules, which stay dynamic
- New imagery
- Any text that was gray-shaded in the source .docx
