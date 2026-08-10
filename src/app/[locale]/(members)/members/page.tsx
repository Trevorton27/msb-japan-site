import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { isValidLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { getCurrentUser } from "@/lib/auth/rbac";
import { getMemberNextEvent, getMemberUpcomingEvents } from "@/server/queries/member-events";
import { getPublishedAnnouncements } from "@/server/queries/member-announcements";
import { getRecentMemberResources, getFeaturedMemberResources } from "@/server/queries/member-resources";
import { t } from "@/lib/admin-locale";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

function formatDate(date: Date, locale: string) {
  return date.toLocaleDateString(locale === "en" ? "en-US" : "ja-JP", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function MemberDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const dict = await getDictionary(locale as Locale);
  const d = dict.members.dashboard;
  const user = await getCurrentUser();

  const [nextEvent, upcomingEvents, announcements, recentResources, featuredResources] =
    await Promise.all([
      getMemberNextEvent(),
      getMemberUpcomingEvents(3),
      getPublishedAnnouncements(3),
      getRecentMemberResources(3),
      getFeaturedMemberResources(1),
    ]);

  const firstName = user?.name?.split(" ")[0] ?? user?.email?.split("@")[0] ?? "";
  const featuredResource = featuredResources[0] ?? recentResources[0] ?? null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-charcoal-900">
          {d.welcome}
          {firstName ? `, ${firstName}` : ""}
        </h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Next Event */}
        <div className="rounded-lg border border-charcoal-200 bg-white p-5">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-charcoal-500">
            {d.nextEvent}
          </h2>
          {nextEvent ? (
            <div>
              <p className="mb-1 font-semibold text-charcoal-900">
                {t(locale as Locale, nextEvent.titleJa, nextEvent.titleEn)}
              </p>
              <p className="mb-3 text-sm text-charcoal-500">
                {formatDate(nextEvent.startsAt, locale)}
              </p>
              <div className="mb-4 flex items-center gap-2">
                <span className="inline-block rounded-full bg-charcoal-200/60 px-2 py-0.5 text-xs text-charcoal-600">
                  {nextEvent.mode === "ONLINE"
                    ? d.online
                    : nextEvent.mode === "HYBRID"
                      ? d.hybrid
                      : d.inPerson}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/${locale}/events/${locale === "en" ? (nextEvent.slugEn ?? nextEvent.slugJa) : nextEvent.slugJa}`}
                  className="rounded-md bg-burgundy-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-burgundy-600"
                >
                  {d.viewDetails}
                </Link>
                {nextEvent.onlineUrl && (nextEvent.mode === "ONLINE" || nextEvent.mode === "HYBRID") && (
                  <a
                    href={nextEvent.onlineUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-md border border-charcoal-200 px-3 py-1.5 text-xs font-medium text-charcoal-700 hover:bg-charcoal-200/30"
                  >
                    {d.joinZoom}
                  </a>
                )}
              </div>
            </div>
          ) : (
            <p className="text-sm text-charcoal-400">{d.noUpcomingEvents}</p>
          )}
        </div>

        {/* Featured Study */}
        <div className="rounded-lg border border-charcoal-200 bg-white p-5">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-charcoal-500">
            {d.featuredStudy}
          </h2>
          {featuredResource ? (
            <div>
              <p className="mb-1 font-semibold text-charcoal-900">
                {t(locale as Locale, featuredResource.titleJa, featuredResource.titleEn)}
              </p>
              {(featuredResource.descriptionJa || featuredResource.descriptionEn) && (
                <p className="mb-4 text-sm text-charcoal-500 line-clamp-2">
                  {t(locale as Locale, featuredResource.descriptionJa, featuredResource.descriptionEn)}
                </p>
              )}
              <Link
                href={`/${locale}/members/study/${locale === "en" ? (featuredResource.slugEn ?? featuredResource.slugJa) : featuredResource.slugJa}`}
                className="text-xs font-medium text-burgundy-500 hover:underline"
              >
                {d.viewDetails} →
              </Link>
            </div>
          ) : (
            <p className="text-sm text-charcoal-400">{d.noResources}</p>
          )}
        </div>

        {/* Announcements */}
        <div className="rounded-lg border border-charcoal-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-charcoal-500">
              {d.announcements}
            </h2>
            <Link href={`/${locale}/members/sangha`} className="text-xs text-burgundy-500 hover:underline">
              {d.viewAll}
            </Link>
          </div>
          {announcements.length > 0 ? (
            <ul className="space-y-3">
              {announcements.map((a) => (
                <li key={a.id} className="border-b border-charcoal-100 pb-3 last:border-0 last:pb-0">
                  {a.pinned && (
                    <span className="mb-1 inline-block text-xs text-saffron-500 font-medium">
                      {dict.members.sangha.pinned}
                    </span>
                  )}
                  <p className="text-sm font-medium text-charcoal-900">
                    {t(locale as Locale, a.titleJa, a.titleEn)}
                  </p>
                  <p className="mt-0.5 text-xs text-charcoal-500">
                    {formatDate(a.publishedAt ?? a.createdAt, locale)}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-charcoal-400">{d.noAnnouncements}</p>
          )}
        </div>

        {/* Upcoming Events */}
        <div className="rounded-lg border border-charcoal-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-charcoal-500">
              {d.upcomingEvents}
            </h2>
            <Link href={`/${locale}/members/events`} className="text-xs text-burgundy-500 hover:underline">
              {d.viewAll}
            </Link>
          </div>
          {upcomingEvents.length > 0 ? (
            <ul className="space-y-3">
              {upcomingEvents.map((event) => (
                <li key={event.id} className="border-b border-charcoal-100 pb-3 last:border-0 last:pb-0">
                  <p className="text-sm font-medium text-charcoal-900">
                    {t(locale as Locale, event.titleJa, event.titleEn)}
                  </p>
                  <p className="mt-0.5 text-xs text-charcoal-500">
                    {formatDate(event.startsAt, locale)}
                    {" · "}
                    {event.mode === "ONLINE" ? d.online : event.mode === "HYBRID" ? d.hybrid : d.inPerson}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-charcoal-400">{d.noUpcomingEvents}</p>
          )}
        </div>

        {/* Recent Resources */}
        <div className="rounded-lg border border-charcoal-200 bg-white p-5 md:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-charcoal-500">
              {d.recentResources}
            </h2>
            <Link href={`/${locale}/members/study`} className="text-xs text-burgundy-500 hover:underline">
              {d.viewAll}
            </Link>
          </div>
          {recentResources.length > 0 ? (
            <ul className="grid gap-3 sm:grid-cols-3">
              {recentResources.map((r) => (
                <li key={r.id}>
                  <Link
                    href={`/${locale}/members/study/${locale === "en" ? (r.slugEn ?? r.slugJa) : r.slugJa}`}
                    className="block rounded-md border border-charcoal-100 p-3 text-sm hover:border-burgundy-500/30 hover:bg-ivory-100 transition-colors"
                  >
                    <p className="font-medium text-charcoal-900 line-clamp-1">
                      {t(locale as Locale, r.titleJa, r.titleEn)}
                    </p>
                    {(r.descriptionJa || r.descriptionEn) && (
                      <p className="mt-1 text-xs text-charcoal-500 line-clamp-2">
                        {t(locale as Locale, r.descriptionJa, r.descriptionEn)}
                      </p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-charcoal-400">{d.noResources}</p>
          )}
        </div>
      </div>
    </div>
  );
}
