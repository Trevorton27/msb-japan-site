<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Content rules

See `docs/content-update/PLAN.md` for the full content-update plan.

- **Copy text verbatim.** Copy every string character for character from `docs/content-update/content-source.json` (the `.txt` outline is authoritative if they disagree). Do not paraphrase, "improve," re-translate, or fix grammar. If something looks wrong, flag it and leave the source text unchanged.
- **Never render editorial notes.** Anything under `editorialNotes`, plus inline markers such as ［EN: …］, ※ notes, サブメニュー lists, 例） examples, （新設） / (New), → ボタン, and 導入, is builder guidance, not site copy.
- **Use a separate store per language.** Never put JA and EN in the same string or render path. Japanese renders only on `/ja`, English only on `/en`.
- **Run the coverage check after every content change:** `node scripts/check-content-coverage.mjs` (or `--section <id>`). Lines deliberately not rendered go in `docs/content-update/coverage-ignore.json` with a reason. Target: zero `missing` and zero `partial`.
