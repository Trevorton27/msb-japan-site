import Link from "next/link";
import type { Metadata } from "next";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { isValidLocale } from "@/lib/i18n/config";
import { notFound } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { NewsletterForm } from "@/components/public/newsletter-form";
import { getPublishedEvents } from "@/server/queries/events";
import { getPublishedBooks } from "@/server/queries/books";
import { getCurrentDharmaMessage } from "@/server/queries/dharma-messages";
import { BookSlider } from "@/components/public/book-slider";

/** Outline list items are written "Label：text" (JA) or "Label: text" (EN). */
function splitListItem(item: string): { label: string; sep: string; text: string } {
  const match = item.match(/^(.+?)(：|: )(.*)$/);
  return match
    ? { label: match[1] ?? item, sep: match[2] ?? "", text: match[3] ?? "" }
    : { label: item, sep: "", text: "" };
}

function LinkedList({
  items,
  hrefs,
  learnMore,
}: {
  items: string[];
  hrefs: string[];
  learnMore: string;
}) {
  return (
    <ul className="mt-8 space-y-4">
      {items.map((item, idx) => {
        const { label, sep, text } = splitListItem(item);
        return (
          <li key={item} className="border-b border-[#1e3560]/10 pb-4 text-[#1e3560]">
            <span className="font-semibold">{label}</span>
            {text && (
              <span className="text-sm">
                {sep}
                {text}
              </span>
            )}
            {hrefs[idx] && (
              <Link
                href={hrefs[idx]}
                className="ml-2 whitespace-nowrap text-xs font-bold text-burgundy-600 transition-opacity hover:opacity-75"
              >
                {learnMore} ›
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return {
    title: dict.metadata?.title,
    description: dict.metadata?.description,
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const dict = await getDictionary(locale as Locale);

  const [upcomingEvents, books, dharmaMessage] = await Promise.all([
    getPublishedEvents({ upcoming: true }),
    getPublishedBooks(),
    getCurrentDharmaMessage(),
  ]);
  const nextEvent = upcomingEvents[0] ?? null;

  function formatEventDates(startsAt: Date, endsAt: Date): string {
    if (locale === "ja") {
      const start = startsAt.toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const sameMonth =
        startsAt.getMonth() === endsAt.getMonth() &&
        startsAt.getFullYear() === endsAt.getFullYear();
      const end = endsAt.toLocaleDateString("ja-JP", {
        ...(sameMonth ? {} : { month: "long" }),
        day: "numeric",
      });
      return `${start}～${end}`;
    }
    const start = startsAt.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const sameMonth =
      startsAt.getMonth() === endsAt.getMonth() &&
      startsAt.getFullYear() === endsAt.getFullYear();
    if (sameMonth) {
      return `${start} – ${endsAt.getDate()}, ${endsAt.getFullYear()}`;
    }
    return `${start} – ${endsAt.toLocaleDateString("en-US", { month: "short", day: "numeric" })}, ${endsAt.getFullYear()}`;
  }

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[60vw] items-center justify-center overflow-hidden px-4 py-16 text-center text-white sm:min-h-0 sm:py-40">
        <div
          className="absolute inset-0 bg-cover bg-center sm:bg-top"
          style={{ backgroundImage: "url('/images/rinpocheHeaderImage.png')" }}
        />
        <div className="absolute inset-0 bg-charcoal-900/60" />
        <div className="relative mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {dict.home?.heroTitle}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-charcoal-200">
            {dict.home?.heroSubtitle}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href={`/${locale}/start`}
              className="rounded-md bg-saffron-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-saffron-600"
            >
              {dict.home?.heroCta}
            </Link>
            <Link
              href={`/${locale}/events`}
              className="rounded-md border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              {dict.common?.events}
            </Link>
          </div>
        </div>
      </section>

      {/* Quote & Nav Buttons */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {dict.home.rinpocheWordsTitle && (
            <h2 className="mb-8 text-3xl font-semibold text-[#1e3560]">
              {dict.home.rinpocheWordsTitle}
            </h2>
          )}
          <blockquote className="text-2xl italic leading-relaxed text-[#1e3560] sm:text-3xl">
            {dict.home?.rinpocheQuote}
          </blockquote>
          <p className="mt-6 text-xs font-bold uppercase tracking-widest text-[#1e3560]">
            {dict.home?.rinpocheQuoteAttribution}
          </p>
          <div className="mt-12 flex flex-wrap justify-center gap-6">
            <Link
              href={`/${locale}/teachers`}
              className="rounded-sm bg-saffron-500 px-10 py-5 text-xs font-bold uppercase tracking-widest text-[#1e3560] transition-colors hover:bg-saffron-600"
            >
              {dict.home?.aboutRinpoche}
            </Link>
            <Link
              href={`/${locale}/vision`}
              className="rounded-sm bg-saffron-500 px-10 py-5 text-xs font-bold uppercase tracking-widest text-[#1e3560] transition-colors hover:bg-saffron-600"
            >
              {dict.home?.visionOfMsb}
            </Link>
            <Link
              href={`/${locale}/programs`}
              className="rounded-sm bg-saffron-500 px-10 py-5 text-xs font-bold uppercase tracking-widest text-[#1e3560] transition-colors hover:bg-saffron-600"
            >
              {dict.common?.programs}
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Program */}
      {nextEvent && (() => {
        const title =
          locale === "en" && nextEvent.titleEn
            ? nextEvent.titleEn
            : nextEvent.titleJa;
        const description =
          locale === "en" && nextEvent.descriptionEn
            ? nextEvent.descriptionEn
            : nextEvent.descriptionJa;
        const truncated = description
          ? description.length > 180
            ? description.slice(0, 180).trimEnd() + "…"
            : description
          : null;
        const slug =
          locale === "en" && nextEvent.slugEn
            ? nextEvent.slugEn
            : nextEvent.slugJa;
        const dateRange = formatEventDates(nextEvent.startsAt, nextEvent.endsAt);
        return (
          <section className="bg-[#dff0ee] px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
              <div className="text-center">
                <h2 className="text-3xl font-semibold text-[#1e3560]">
                  {dict.home?.upcomingProgram}
                </h2>
                <div className="mx-auto mt-3 h-0.5 w-20 bg-saffron-500" />
              </div>
              <div className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-start">
                {nextEvent.imageUrl && (
                  <div className="shrink-0 sm:w-64">
                    <img
                      src={nextEvent.imageUrl}
                      alt={title}
                      className="w-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold text-[#1e3560]">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm text-[#1e3560]">{dateRange}</p>
                  {truncated && (
                    <p className="mt-4 text-sm leading-relaxed text-[#1e3560]">
                      {truncated}
                    </p>
                  )}
                  <Link
                    href={`/${locale}/events/${slug}`}
                    className="mt-6 inline-block rounded-sm bg-saffron-500 px-8 py-3 text-xs font-bold uppercase tracking-widest text-[#1e3560] transition-colors hover:bg-saffron-600"
                  >
                    {dict.home?.learnMoreOrRegister}
                  </Link>
                </div>
              </div>
              <div className="mt-12 border-t border-[#1e3560]/20" />
            </div>
          </section>
        );
      })()}

      {/* Programs & Activities */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-[#1e3560]">
              {dict.home.programsTitle}
            </h2>
            <div className="mx-auto mt-3 h-0.5 w-20 bg-saffron-500" />
          </div>
          <blockquote className="mt-8 text-center text-lg italic leading-relaxed text-[#1e3560]">
            {dict.home.programsQuote}
            {dict.home.programsQuoteAttribution && (
              <footer className="mt-3 text-xs font-bold uppercase not-italic tracking-widest">
                {dict.home.programsQuoteAttribution}
              </footer>
            )}
          </blockquote>
          <p className="mt-8 leading-relaxed text-[#1e3560]">
            {dict.home.programsIntro}
          </p>
          <LinkedList
            items={dict.home.programsList}
            hrefs={[
              `/${locale}/programs#online-lineage-course`,
              `/${locale}/programs#in-person`,
              `/${locale}/programs#in-person`,
              `/${locale}/programs#tsok`,
              `/${locale}/programs#compassionate-activity`,
            ]}
            learnMore={dict.common.learnMore}
          />
        </div>
      </section>

      {/* Weekly Dharma Message */}
      <section className="bg-[#dff0ee] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold text-[#1e3560]">
            {dict.home?.weeklyDharmaMessage}
          </h2>
          <div className="mx-auto mt-3 h-0.5 w-20 bg-saffron-500" />
          <blockquote className="mt-8 text-base leading-relaxed text-[#1e3560]">
            {dharmaMessage
              ? (locale === "en" && dharmaMessage.quoteEn
                  ? dharmaMessage.quoteEn
                  : dharmaMessage.quoteJa)
              : dict.home?.weeklyDharmaQuote}
          </blockquote>
          <p className="mt-6 text-xs font-bold uppercase tracking-widest text-[#1e3560]">
            {dharmaMessage
              ? (locale === "en" && dharmaMessage.attributionEn
                  ? dharmaMessage.attributionEn
                  : dharmaMessage.attributionJa)
              : dict.home?.weeklyDharmaAttribution}
          </p>
          {dharmaMessage?.sourceJa && (
            <p className="mt-2 text-xs text-[#1e3560]/60">
              {locale === "en" && dharmaMessage.sourceEn
                ? dharmaMessage.sourceEn
                : dharmaMessage.sourceJa}
            </p>
          )}
        </div>
      </section>

      {/* Teachings & Learning Resources */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-[#1e3560]">
              {dict.home.resourcesTitle}
            </h2>
            <div className="mx-auto mt-3 h-0.5 w-20 bg-saffron-500" />
          </div>
          <p className="mt-8 leading-relaxed text-[#1e3560]">
            {dict.home.resourcesIntro}
          </p>
          <LinkedList
            items={dict.home.resourcesList}
            hrefs={[
              `/${locale}/teachings/${locale === "en" ? "msbj-link-en" : "msbj-link"}`,
              `/${locale}/blog`,
              `/${locale}/videos`,
              `/${locale}/shop`,
            ]}
            learnMore={dict.common.learnMore}
          />
        </div>
      </section>

      {/* Book Slider */}
      {books.length > 0 && (
        <section className="bg-[#dff0ee] px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-semibold text-[#1e3560]">
                {locale === "ja" ? "書籍・出版物" : "Books & Publications"}
              </h2>
              <div className="mx-auto mt-3 h-0.5 w-20 bg-saffron-500" />
            </div>
            <BookSlider
              books={books.map((b) => ({
                slug: locale === "en" && b.slugEn ? b.slugEn : b.slugJa,
                title: locale === "en" && b.titleEn ? b.titleEn : b.titleJa,
                author:
                  locale === "en" && b.authorEn
                    ? b.authorEn
                    : (b.authorJa ?? null),
                imageUrl: b.imageUrl,
                href: `/${locale}/books/${locale === "en" && b.slugEn ? b.slugEn : b.slugJa}`,
              }))}
              heading={locale === "ja" ? "書籍・出版物" : "Books & Publications"}
              learnMoreLabel={dict.common?.learnMore ?? ""}
            />
          </div>
        </section>
      )}

      {/* Our Centers */}
      <section className="bg-ivory-100 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-[#1e3560]">
              {dict.home.ourCentersTitle}
            </h2>
            <div className="mx-auto mt-3 h-0.5 w-20 bg-saffron-500" />
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {dict.home.ourCentersList.map((name, idx) => (
              <Link key={name} href={`/${locale}/centres#${idx === 0 ? "kyoto" : "izu"}`}>
                <Card className="h-full transition-shadow hover:shadow-md">
                  <CardHeader>
                    <CardTitle className="text-[#1e3560]">{name}</CardTitle>
                    <CardDescription>{dict.common.learnMore} ›</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-charcoal-500">
            {dict.home.ourCentersReference}
          </p>
        </div>
      </section>

      {/* Banners */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {dict.home.banners.map((banner, idx) => {
            const { label, text } = splitListItem(banner);
            const href = [`/${locale}/start`, `/${locale}/events`, `/${locale}/teachings`][idx];
            return (
              <Link key={banner} href={href ?? `/${locale}`}>
                <Card className="h-full transition-shadow hover:shadow-md">
                  <CardHeader>
                    <CardTitle className="text-burgundy-500">{label}</CardTitle>
                    {text && <CardDescription>{text}</CardDescription>}
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Donate CTA */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-charcoal-900">
            {dict.home?.donateCta}
          </h2>
          <p className="mt-4 text-charcoal-600">{dict.home?.donateDesc}</p>
          <Link
            href={`/${locale}/donate`}
            className="mt-6 inline-block rounded-md bg-burgundy-500 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-burgundy-600"
          >
            {dict.home?.donateButton}
          </Link>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-ivory-100 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-2xl font-bold text-charcoal-900">
            {dict.home?.newsletterTitle}
          </h2>
          <p className="mt-2 text-charcoal-600">{dict.home?.newsletterDesc}</p>
          <div className="mt-6 flex justify-center">
            <NewsletterForm
              placeholder={dict.home?.newsletterPlaceholder ?? ""}
              buttonText={dict.home?.newsletterButton ?? ""}
              successText={dict.home?.newsletterSuccess ?? ""}
            />
          </div>
        </div>
      </section>
    </>
  );
}
