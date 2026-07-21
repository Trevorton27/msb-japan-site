import Link from "next/link";
import type { Metadata } from "next";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { isValidLocale } from "@/lib/i18n/config";
import { notFound } from "next/navigation";
import { getPublishedEvents } from "@/server/queries/events";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { EventFilters } from "@/components/public/event-filters";
import type { EventMode } from "@prisma/client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return {
    title: dict.metadata?.eventsTitle,
    description: dict.metadata?.eventsDescription,
  };
}

export default async function EventsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale as Locale);
  const query = await searchParams;

  const mode = query.mode as EventMode | undefined;
  const beginnerFriendly = query.beginner === "true" ? true : undefined;

  const events = await getPublishedEvents({ mode, beginnerFriendly });

  const modeLabels: Record<string, string> = {
    IN_PERSON: dict.events?.inPerson ?? "In Person",
    ONLINE: dict.events?.online ?? "Online",
    HYBRID: dict.events?.hybrid ?? "Hybrid",
  };

  const priceLabels: Record<string, string> = {
    FREE: dict.events?.free ?? "Free",
    DONATION: dict.events?.donation ?? "Donation",
    SLIDING_SCALE: dict.events?.slidingScale ?? "Sliding Scale",
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-charcoal-900">
        {dict.events?.title}
      </h1>

      <div className="mt-6">
        <EventFilters
          locale={locale}
          labels={{
            allModes: dict.events?.allModes ?? "All",
            online: dict.events?.online ?? "Online",
            inPerson: dict.events?.inPerson ?? "In Person",
            hybrid: dict.events?.hybrid ?? "Hybrid",
            filterBeginner: dict.events?.filterBeginner ?? "Beginner Friendly",
          }}
        />
      </div>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-charcoal-900">
          {dict.events?.upcoming}
        </h2>

        {events.length === 0 ? (
          <div className="mt-4">
            <p className="text-charcoal-500">{dict.events?.noUpcoming}</p>
            <p className="mt-2 text-sm text-charcoal-500">
              {dict.events?.checkBack}
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {events.map((event) => {
              const slug = locale === "en" && event.slugEn ? event.slugEn : event.slugJa;
              const title = locale === "en" && event.titleEn ? event.titleEn : event.titleJa;
              const desc =
                locale === "en" && event.descriptionEn
                  ? event.descriptionEn
                  : event.descriptionJa;

              return (
                <Link key={event.id} href={`/${locale}/events/${slug}`}>
                  <Card className="transition-shadow hover:shadow-md">
                    <CardHeader>
                      <div className="flex flex-wrap items-center gap-2">
                        <CardTitle className="text-lg">{title}</CardTitle>
                        <Badge variant="secondary">
                          {modeLabels[event.mode] ?? event.mode}
                        </Badge>
                        {event.beginnerFriendly && (
                          <Badge className="bg-saffron-500 text-white">
                            {dict.events?.beginnerFriendly}
                          </Badge>
                        )}
                        <Badge variant="outline">
                          {event.priceType === "FIXED" && event.priceAmount
                            ? `¥${event.priceAmount.toLocaleString()}`
                            : (priceLabels[event.priceType] ?? event.priceType)}
                        </Badge>
                      </div>
                      <CardDescription className="mt-1">
                        <span className="font-medium">
                          {event.startsAt.toLocaleDateString(
                            locale === "ja" ? "ja-JP" : "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              weekday: "short",
                            }
                          )}
                        </span>
                        {event.venue && (
                          <span className="ml-2">
                            {locale === "en" && event.venue.nameEn
                              ? event.venue.nameEn
                              : event.venue.nameJa}
                          </span>
                        )}
                      </CardDescription>
                      {desc && (
                        <p className="mt-2 line-clamp-2 text-sm text-charcoal-600">
                          {desc}
                        </p>
                      )}
                    </CardHeader>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
