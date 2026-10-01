/**
 * Apply the outline v11 content update to an existing database without
 * re-running the full seed (which would overwrite admin edits on every post).
 *
 * Touches only these rows, matched by slugJa:
 *   - Teacher: dzigar-kongtrul-rinpoche, dilgo-khyentse-rinpoche, dungse-jampal-norbu
 *       nameJa, nameEn, bioJa, bioEn
 *   - Event: zazenkai-2026-09
 *       descriptionJa, descriptionEn
 *   - ContentPost: msbj-link, dharma-article, video-howa
 *       excerptJa, excerptEn, and the first <p> of bodyJa / bodyEn
 *       (the rest of the body is left as-is)
 *
 * Idempotent: rows already matching the new text are reported as unchanged.
 *
 * Usage:
 *   pnpm tsx prisma/scripts/apply-outline-v11.ts --dry-run   # print the diff only
 *   pnpm tsx prisma/scripts/apply-outline-v11.ts             # apply
 *
 * DATABASE_URL is read from the environment, falling back to .env.local / .env.
 */
import fs from "node:fs";
import path from "node:path";
import { PrismaClient, type Prisma } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  legacyEvents,
  legacyPosts,
  legacyTeachers,
} from "../seed-data/legacy-content";

const TEACHER_SLUGS = [
  "dzigar-kongtrul-rinpoche",
  "dilgo-khyentse-rinpoche",
  "dungse-jampal-norbu",
];
const EVENT_SLUGS = ["zazenkai-2026-09"];
const POST_SLUGS = ["msbj-link", "dharma-article", "video-howa"];

const dryRun = process.argv.includes("--dry-run");

function loadEnv() {
  if (process.env.DATABASE_URL) return;
  const root = path.join(__dirname, "..", "..");
  for (const name of [".env.local", ".env"]) {
    const file = path.join(root, name);
    if (!fs.existsSync(file)) continue;
    for (const line of fs.readFileSync(file, "utf-8").split("\n")) {
      const match = line.match(/^\s*([^#=]+?)\s*=\s*(.*)\s*$/);
      if (match && match[1] && !process.env[match[1]]) {
        process.env[match[1]] = (match[2] ?? "").replace(/^["']|["']$/g, "");
      }
    }
    return;
  }
}

function find<T extends { slugJa: string }>(rows: T[], slug: string): T {
  const row = rows.find((r) => r.slugJa === slug);
  if (!row) throw new Error(`seed data has no entry for ${slug}`);
  return row;
}

/** Replace the first <p>…</p> of an HTML body with the intro paragraph from the seed body. */
function withIntro(current: string | null, seedBody: string): string {
  const intro = seedBody.match(/<p>[\s\S]*?<\/p>/)?.[0];
  if (!intro) throw new Error("seed body has no <p> intro");
  if (!current) return seedBody;
  return /<p>[\s\S]*?<\/p>/.test(current)
    ? current.replace(/<p>[\s\S]*?<\/p>/, intro)
    : `${intro}\n${current}`;
}

type Change = { field: string; from: string | null; to: string };

function diff<K extends string>(
  current: { [F in NoInfer<K>]: string | null },
  next: { [F in K]: string }
): Change[] {
  return (Object.keys(next) as K[])
    .filter((field) => current[field] !== next[field])
    .map((field) => ({ field, from: current[field], to: next[field] }));
}

function printChanges(label: string, changes: Change[]) {
  if (changes.length === 0) {
    console.log(`  = ${label}: unchanged`);
    return;
  }
  console.log(`  ~ ${label}`);
  for (const c of changes) {
    console.log(`    ${c.field}:`);
    const before = (c.from ?? "").split("\n");
    const after = c.to.split("\n");
    for (const line of before.filter((l) => l.trim() && !after.includes(l)))
      console.log(`      - ${line}`);
    for (const line of after.filter((l) => l.trim() && !before.includes(l)))
      console.log(`      + ${line}`);
  }
}

async function main() {
  loadEnv();
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not set");
  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });

  console.log(
    dryRun
      ? "DRY RUN — no changes will be written\n"
      : "Applying outline v11 content\n"
  );
  const writes: ((tx: Prisma.TransactionClient) => Promise<unknown>)[] = [];

  try {
    console.log("Teachers");
    for (const slug of TEACHER_SLUGS) {
      const seed = find(legacyTeachers, slug);
      const row = await prisma.teacher.findUnique({ where: { slugJa: slug } });
      if (!row) {
        console.log(`  ! ${slug}: not found in database, skipped`);
        continue;
      }
      const next = {
        nameJa: seed.nameJa,
        nameEn: seed.nameEn,
        bioJa: seed.bioJa,
        bioEn: seed.bioEn,
      };
      const changes = diff(row, next);
      printChanges(slug, changes);
      if (changes.length) {
        writes.push((tx) =>
          tx.teacher.update({ where: { slugJa: slug }, data: next })
        );
      }
    }

    console.log("\nEvents");
    for (const slug of EVENT_SLUGS) {
      const seed = find(legacyEvents, slug);
      const row = await prisma.event.findUnique({ where: { slugJa: slug } });
      if (!row) {
        console.log(`  ! ${slug}: not found in database, skipped`);
        continue;
      }
      const next = {
        descriptionJa: seed.descriptionJa,
        descriptionEn: seed.descriptionEn,
      };
      const changes = diff(row, next);
      printChanges(slug, changes);
      if (changes.length) {
        writes.push((tx) =>
          tx.event.update({ where: { slugJa: slug }, data: next })
        );
      }
    }

    console.log("\nContent posts");
    for (const slug of POST_SLUGS) {
      const seed = find(legacyPosts, slug);
      const row = await prisma.contentPost.findUnique({
        where: { slugJa: slug },
      });
      if (!row) {
        console.log(`  ! ${slug}: not found in database, skipped`);
        continue;
      }
      const next = {
        excerptJa: seed.excerptJa,
        excerptEn: seed.excerptEn,
        bodyJa: withIntro(row.bodyJa, seed.bodyJa),
        bodyEn: withIntro(row.bodyEn, seed.bodyEn),
      };
      const changes = diff(row, next);
      printChanges(slug, changes);
      if (changes.length) {
        writes.push((tx) =>
          tx.contentPost.update({ where: { slugJa: slug }, data: next })
        );
      }
    }

    console.log(`\n${writes.length} row(s) to update.`);
    if (dryRun || writes.length === 0) return;

    await prisma.$transaction(async (tx) => {
      for (const write of writes) await write(tx);
    });
    console.log("Done.");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
