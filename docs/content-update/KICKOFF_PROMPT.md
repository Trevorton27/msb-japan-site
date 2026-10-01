Paste this into Claude Code from the repo root, after copying in the content-update kit:

---

We're updating all public site text from an approved bilingual outline. Read `docs/content-update/PLAN.md` in full before doing anything.

The source text is `docs/content-update/source-outline-v11.txt`, and its parsed form is `content-source.json`. Copy text verbatim: never paraphrase or re-translate it. Japanese renders only on /ja and English only on /en.

Start with Phase 0 only. Then stop, show me the coverage-check baseline, and list any open decisions (§5 of the plan) that block Phase 1. After each later phase, run the checks listed in the plan, commit, summarize, and wait for my go-ahead before continuing.
