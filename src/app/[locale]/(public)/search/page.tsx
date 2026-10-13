import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isValidLocale } from "@/lib/i18n/config";
import type { Locale } from "@/lib/i18n/config";
import { searchSite } from "@/server/search/site-search";
import type { SearchGroup, SearchResult } from "@/server/search/site-search";

const GROUP_ORDER: SearchGroup[] = [
  "pages",
  "teachings",
  "events",
  "books",
  "videos",
  "products",
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return { title: dict.search.title, robots: { index: false } };
}

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale as Locale);
  const s = dict.search;

  const raw = (await searchParams).q;
  const query = (Array.isArray(raw) ? raw[0] : raw)?.trim().slice(0, 100) ?? "";

  let results: SearchResult[] = [];
  if (query) {
    // Pages are indexed by fetching them from this same deployment. On Vercel
    // the Host header is always a domain routed to this deployment.
    const h = await headers();
    const host = h.get("host") ?? "localhost:3000";
    const proto =
      h.get("x-forwarded-proto") ??
      (host.startsWith("localhost") ? "http" : "https");
    results = await searchSite(query, locale as Locale, {
      origin: `${proto}://${host}`,
      cookie: h.get("cookie"),
    });
  }

  const groupLabels: Record<SearchGroup, string> = {
    pages: s.pages,
    teachings: s.teachings,
    events: s.events,
    books: s.books,
    videos: s.videos,
    products: s.products,
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold text-[#1e3560]">{s.title}</h1>

      <form
        role="search"
        action={`/${locale}/search`}
        className="mt-6 flex items-center gap-2"
      >
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder={s.placeholder}
          aria-label={s.label}
          className="min-w-0 flex-1 rounded-md border border-charcoal-200 bg-white px-3 py-2 text-charcoal-900 outline-none focus:border-burgundy-500"
        />
        <button
          type="submit"
          className="rounded-md bg-burgundy-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-burgundy-600"
        >
          {s.submit}
        </button>
      </form>

      {!query ? (
        <p className="mt-8 text-charcoal-600">{s.prompt}</p>
      ) : (
        <>
          <p className="mt-8 text-sm text-charcoal-500">
            {s.resultsFor.replace("{q}", query)}
          </p>
          {results.length === 0 ? (
            <p className="mt-6 text-charcoal-600">{s.noResults}</p>
          ) : (
            GROUP_ORDER.map((group) => {
              const items = results.filter((r) => r.group === group);
              if (items.length === 0) return null;
              return (
                <section key={group} className="mt-10">
                  <h2 className="border-b border-charcoal-200 pb-2 text-lg font-semibold text-[#1e3560]">
                    {groupLabels[group]}
                  </h2>
                  <ul className="mt-4 space-y-5">
                    {items.map((r) => (
                      <li key={`${r.href}-${r.title}`}>
                        <Link
                          href={r.href}
                          className="font-medium text-burgundy-500 hover:text-burgundy-600 hover:underline"
                        >
                          {r.title}
                        </Link>
                        {r.snippet && (
                          <p className="mt-1 text-sm leading-relaxed text-charcoal-600">
                            {r.snippet}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })
          )}
        </>
      )}
    </div>
  );
}
