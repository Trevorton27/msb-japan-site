#!/usr/bin/env node
/* global process */
/**
 * Content coverage check for the MSBJ outline v11 content update.
 *
 * Verifies that every JA and EN line in docs/content-update/content-source.json
 * appears somewhere in the codebase content (dictionaries, page content objects,
 * seed data). Whitespace, line wrapping, and quote style are ignored.
 *
 * Usage:
 *   node scripts/check-content-coverage.mjs                 # all sections, summary + missing lines
 *   node scripts/check-content-coverage.mjs --section 3-1   # one section
 *   node scripts/check-content-coverage.mjs --json          # machine-readable report
 *
 * Lines intentionally not rendered must be listed in
 * docs/content-update/coverage-ignore.json as { "line": <n>, "reason": "..." }.
 * Exit code is 1 if any non-ignored line is missing or only partially matched.
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, extname } from "node:path";

const ROOT = process.cwd();
const SOURCE = join(ROOT, "docs/content-update/content-source.json");
const IGNORE = join(ROOT, "docs/content-update/coverage-ignore.json");
const SCAN_DIRS = ["src", "prisma/seed-data", "prisma/scripts"];
const SCAN_EXT = new Set([".ts", ".tsx", ".json", ".md", ".mdx"]);

const args = process.argv.slice(2);
const sectionFilter = args.includes("--section") ? args[args.indexOf("--section") + 1] : null;
const asJson = args.includes("--json");

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name.startsWith(".")) continue;
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, out);
    else if (SCAN_EXT.has(extname(name))) out.push(p);
  }
  return out;
}

/** Collapse everything that can legitimately differ between source and code. */
function normalize(s) {
  return s
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/\\[nrt]/g, " ")
    .replace(/\\(["'`\\])/g, "$1")
    .replace(/&quot;|&#39;|&apos;|&rsquo;|&lsquo;|&ldquo;|&rdquo;/g, "'")
    .replace(/[“”"″]/g, "'")
    .replace(/[‘’`′]/g, "'")
    .replace(/[—–―]/g, "-")
    .replace(/\s+/g, "")
    .replace(/[{}]/g, "");
}

/** Strip outline-only markers that are never meant to be rendered verbatim. */
function cleanSourceLine(s) {
  return s.replace(/（新設）|\(New\)/g, "").trim();
}

const source = JSON.parse(readFileSync(SOURCE, "utf8"));
const ignore = existsSync(IGNORE) ? JSON.parse(readFileSync(IGNORE, "utf8")) : [];
const ignored = new Map(ignore.map((i) => [i.line, i.reason]));

const lineNumbers = readFileSync(join(ROOT, "docs/content-update/source-outline-v11.txt"), "utf8")
  .split("\n")
  .reduce((m, l, i) => (l.trim() && !m.has(l.trim()) ? m.set(l.trim(), i + 1) : m), new Map());

const corpus = walk(join(ROOT, SCAN_DIRS[0]))
  .concat(...SCAN_DIRS.slice(1).map((d) => walk(join(ROOT, d))))
  .filter((p) => !p.includes("content-update"))
  .map((p) => normalize(readFileSync(p, "utf8")))
  .join("\n");

const report = [];
for (const section of source.sections) {
  if (sectionFilter && section.id !== sectionFilter) continue;
  const rows = [];
  for (const block of section.blocks) {
    for (const lang of ["ja", "en"]) {
      for (const raw of block[lang]) {
        const line = lineNumbers.get(raw.trim()) ?? null;
        const text = cleanSourceLine(raw);
        const n = normalize(text);
        let status;
        if (ignored.has(line)) status = "ignored";
        else if (n.length === 0 || corpus.includes(n)) status = "ok";
        else if (n.length > 24 && corpus.includes(n.slice(0, 24))) status = "partial";
        else status = "missing";
        rows.push({ line, lang, status, text, reason: ignored.get(line) });
      }
    }
  }
  report.push({ id: section.id, slug: section.slug, rows });
}

if (asJson) {
  console.log(JSON.stringify(report, null, 2));
} else {
  let bad = 0;
  for (const s of report) {
    const c = (st) => s.rows.filter((r) => r.status === st).length;
    console.log(
      `${s.id.padStart(6)} ${s.slug.padEnd(20)} ok=${c("ok")} partial=${c("partial")} missing=${c("missing")} ignored=${c("ignored")}`,
    );
    for (const r of s.rows.filter((r) => r.status === "missing" || r.status === "partial")) {
      bad++;
      console.log(`         L${r.line} [${r.lang}] ${r.status.toUpperCase()}: ${r.text.slice(0, 70)}`);
    }
  }
  console.log(bad ? `\n${bad} line(s) not yet on the site.` : "\nAll source lines are covered.");
}
const failed = report.some((s) => s.rows.some((r) => r.status === "missing" || r.status === "partial"));
process.exit(failed ? 1 : 0);
