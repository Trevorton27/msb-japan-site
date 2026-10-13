import { db } from "@/lib/db";
import type { Locale } from "@/lib/i18n/config";

export type SearchGroup =
  | "pages"
  | "teachings"
  | "events"
  | "books"
  | "videos"
  | "products";

export interface SearchResult {
  group: SearchGroup;
  title: string;
  href: string;
  snippet: string;
}

// Public pages whose copy lives in code (dictionaries and page-level content
// objects). Rather than duplicate that copy into an index, the rendered pages
// are fetched and their <main> text is indexed.
const STATIC_PATHS = [
  "",
  "/about",
  "/vision",
  "/history",
  "/organization-info",
  "/bylaws",
  "/lineage",
  "/lineage/buddhism",
  "/lineage/tibetan-buddhism",
  "/lineage/nyingma",
  "/lineage/longchen-nyingtik",
  "/teachers",
  "/centres",
  "/programs",
  "/gatherings",
  "/member-programs",
  "/start",
  "/life-release",
  "/prayer-requests",
  "/donate",
  "/contact",
  "/events",
  "/teachings",
  "/blog",
  "/videos",
  "/shop",
  "/privacy",
  "/tokushoho",
];

interface IndexedPage {
  title: string;
  href: string;
  text: string;
}

const PAGE_INDEX_TTL_MS = 60 * 60 * 1000;
const pageIndexCache = new Map<
  Locale,
  { builtAt: number; pages: Promise<IndexedPage[]> }
>();

const ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
};

function decodeEntities(s: string): string {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, code: string) => {
    if (code[0] === "#") {
      const n =
        code[1] === "x" || code[1] === "X"
          ? parseInt(code.slice(2), 16)
          : parseInt(code.slice(1), 10);
      return Number.isFinite(n) ? String.fromCodePoint(n) : m;
    }
    return ENTITIES[code.toLowerCase()] ?? m;
  });
}

function htmlToText(html: string): string {
  return decodeEntities(
    html
      .replace(/<(script|style|noscript|template)[\s\S]*?<\/\1>/gi, " ")
      .replace(/<[^>]+>/g, " ")
  )
    .replace(/\s+/g, " ")
    .trim();
}

function extractPage(html: string, href: string): IndexedPage | null {
  // When a page streams (dynamic render), <main> holds the loading fallback
  // and the real content arrives in hidden `S:n` segments later in the body.
  const segments = [
    html.match(/<main[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? "",
    ...[...html.matchAll(/<div hidden id="S:\d+">([\s\S]*?)<\/div><script>/g)].map(
      (m) => m[1]
    ),
  ];
  const main = segments.join(" ");
  if (!main.trim()) return null;
  const h1 = main.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1];
  const docTitle = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1];
  const title = htmlToText(h1 ?? docTitle ?? "").replace(/\s+—\s+.*$/, "");
  return { title: title || href, href, text: htmlToText(main) };
}

// Fetching every page at once would render them all concurrently and can
// exhaust the database connection pool, so pages are fetched a few at a time.
const PAGE_FETCH_CONCURRENCY = 3;

async function buildPageIndex(
  locale: Locale,
  origin: string,
  cookie: string | null
): Promise<IndexedPage[]> {
  async function fetchPage(path: string): Promise<IndexedPage | null> {
    const href = `/${locale}${path}`;
    try {
      const res = await fetch(`${origin}${href}`, {
        // Forward the visitor's cookies so preview deployments behind
        // Vercel Authentication can still be read.
        headers: cookie ? { cookie } : undefined,
        cache: "no-store",
      });
      if (!res.ok) return null;
      return extractPage(await res.text(), href);
    } catch {
      return null;
    }
  }

  const pages: (IndexedPage | null)[] = [];
  let next = 0;
  await Promise.all(
    Array.from({ length: PAGE_FETCH_CONCURRENCY }, async () => {
      while (next < STATIC_PATHS.length) {
        const i = next++;
        pages[i] = await fetchPage(STATIC_PATHS[i]!);
      }
    })
  );
  return pages.filter((p): p is IndexedPage => p != null);
}

function getPageIndex(
  locale: Locale,
  origin: string,
  cookie: string | null
): Promise<IndexedPage[]> {
  const cached = pageIndexCache.get(locale);
  if (cached && Date.now() - cached.builtAt < PAGE_INDEX_TTL_MS) {
    return cached.pages;
  }
  const pages = buildPageIndex(locale, origin, cookie);
  pageIndexCache.set(locale, { builtAt: Date.now(), pages });
  // Don't keep a failed or empty build around for the full TTL.
  pages.then(
    (list) => {
      if (list.length === 0) pageIndexCache.delete(locale);
    },
    () => pageIndexCache.delete(locale)
  );
  return pages;
}

function makeSnippet(text: string, terms: string[], length = 160): string {
  const lower = text.toLowerCase();
  let at = -1;
  for (const term of terms) {
    at = lower.indexOf(term);
    if (at !== -1) break;
  }
  if (at === -1) {
    return text.length > length ? text.slice(0, length).trimEnd() + "…" : text;
  }
  const start = Math.max(0, at - Math.floor(length / 3));
  const end = Math.min(text.length, start + length);
  return (
    (start > 0 ? "…" : "") +
    text.slice(start, end).trim() +
    (end < text.length ? "…" : "")
  );
}

function tokenize(query: string): string[] {
  return query
    .toLowerCase()
    .split(/[\s　]+/)
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 8);
}

function matchesAll(haystack: string, terms: string[]): boolean {
  const lower = haystack.toLowerCase();
  return terms.every((t) => lower.includes(t));
}

function score(title: string, text: string, terms: string[]): number {
  const t = title.toLowerCase();
  const body = text.toLowerCase();
  let s = 0;
  for (const term of terms) {
    if (t.includes(term)) s += 10;
    s += Math.min(body.split(term).length - 1, 5);
  }
  return s;
}

/**
 * Searches public site content for the given locale. Only content available
 * in that locale is returned (English results need English fields), matching
 * the rule that each language renders from its own store.
 */
export async function searchSite(
  rawQuery: string,
  locale: Locale,
  { origin, cookie }: { origin: string; cookie: string | null }
): Promise<SearchResult[]> {
  const terms = tokenize(rawQuery);
  if (terms.length === 0) return [];
  const en = locale === "en";

  // Prisma filters narrow the rows; the exact all-terms match happens below.
  const contains = (field: string) =>
    terms.map((t) => ({ [field]: { contains: t, mode: "insensitive" as const } }));
  const anyOf = (...fields: string[]) => ({
    OR: fields.flatMap((f) => contains(f)),
  });

  const now = new Date();
  const [pages, posts, events, books, videos, products] = await Promise.all([
    getPageIndex(locale, origin, cookie).catch(() => [] as IndexedPage[]),
    db.contentPost.findMany({
      where: {
        status: "PUBLISHED",
        AND: [
          { OR: [{ publishedAt: { lte: now } }, { publishedAt: null }] },
          en
            ? anyOf("titleEn", "excerptEn", "bodyEn")
            : anyOf("titleJa", "excerptJa", "bodyJa"),
        ],
        ...(en ? { slugEn: { not: null }, titleEn: { not: null } } : {}),
      },
      take: 50,
    }),
    db.event.findMany({
      where: {
        status: "PUBLISHED",
        visibility: "PUBLIC",
        ...(en
          ? {
              slugEn: { not: null },
              titleEn: { not: null },
              ...anyOf("titleEn", "descriptionEn"),
            }
          : anyOf("titleJa", "descriptionJa")),
      },
      orderBy: { startsAt: "desc" },
      take: 50,
    }),
    db.book.findMany({
      where: {
        active: true,
        ...(en
          ? {
              slugEn: { not: null },
              titleEn: { not: null },
              ...anyOf("titleEn", "authorEn", "descriptionEn"),
            }
          : anyOf("titleJa", "authorJa", "descriptionJa")),
      },
      take: 50,
    }),
    db.video.findMany({
      where: {
        published: true,
        ...(en
          ? { titleEn: { not: null }, ...anyOf("titleEn", "descriptionEn") }
          : anyOf("titleJa", "descriptionJa")),
      },
      take: 50,
    }),
    db.product.findMany({
      where: {
        active: true,
        ...(en
          ? {
              slugEn: { not: null },
              nameEn: { not: null },
              ...anyOf("nameEn", "descriptionEn"),
            }
          : anyOf("nameJa", "descriptionJa")),
      },
      take: 50,
    }),
  ]);

  const candidates: (SearchResult & { text: string })[] = [
    ...pages.map((p) => ({
      group: "pages" as const,
      title: p.title,
      href: p.href,
      text: p.text,
      snippet: "",
    })),
    ...posts.map((p) => {
      const slug = en ? p.slugEn! : p.slugJa;
      const section = p.type === "BLOG" ? "blog" : "teachings";
      return {
        group: "teachings" as const,
        title: en ? p.titleEn! : p.titleJa,
        href: `/${locale}/${section}/${slug}`,
        text: htmlToText(
          [en ? p.excerptEn : p.excerptJa, en ? p.bodyEn : p.bodyJa]
            .filter(Boolean)
            .join(" ")
        ),
        snippet: "",
      };
    }),
    ...events.map((e) => ({
      group: "events" as const,
      title: en ? e.titleEn! : e.titleJa,
      href: `/${locale}/events/${en ? e.slugEn! : e.slugJa}`,
      text: htmlToText((en ? e.descriptionEn : e.descriptionJa) ?? ""),
      snippet: "",
    })),
    ...books.map((b) => ({
      group: "books" as const,
      title: en ? b.titleEn! : b.titleJa,
      href: `/${locale}/books/${en ? b.slugEn! : b.slugJa}`,
      text: htmlToText(
        [en ? b.authorEn : b.authorJa, en ? b.descriptionEn : b.descriptionJa]
          .filter(Boolean)
          .join(" ")
      ),
      snippet: "",
    })),
    ...videos.map((v) => ({
      group: "videos" as const,
      title: en ? v.titleEn! : v.titleJa,
      href: `/${locale}/videos`,
      text: htmlToText((en ? v.descriptionEn : v.descriptionJa) ?? ""),
      snippet: "",
    })),
    ...products.map((p) => ({
      group: "products" as const,
      title: en ? p.nameEn! : p.nameJa,
      href: `/${locale}/shop/${en ? p.slugEn! : p.slugJa}`,
      text: htmlToText((en ? p.descriptionEn : p.descriptionJa) ?? ""),
      snippet: "",
    })),
  ];

  return candidates
    .filter((c) => matchesAll(`${c.title} ${c.text}`, terms))
    .map((c) => ({ ...c, rank: score(c.title, c.text, terms) }))
    .sort((a, b) => b.rank - a.rank)
    .slice(0, 60)
    .map(({ group, title, href, text }) => ({
      group,
      title,
      href,
      snippet: makeSnippet(text, terms),
    }));
}
