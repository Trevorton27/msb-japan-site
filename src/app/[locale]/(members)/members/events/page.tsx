import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isValidLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { getCurrentUser } from "@/lib/auth/rbac";
import { getMemberUpcomingEvents, getMemberEventRegistrations } from "@/server/queries/member-events";
import { t } from "@/lib/admin-locale";
import { MemberEventsClient } from "./events-client";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function MemberEventsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const dict = await getDictionary(locale as Locale);
  const user = await getCurrentUser();

  const [events, registrations] = await Promise.all([
    getMemberUpcomingEvents(),
    user ? getMemberEventRegistrations(user.id) : Promise.resolve([]),
  ]);

  const registeredEventIds = new Set(
    registrations
      .filter((r) => r.status === "REGISTERED" || r.status === "WAITLISTED")
      .map((r) => r.eventId)
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-2xl font-semibold text-charcoal-900">
        {dict.members.events.title}
      </h1>
      <p className="mb-8 text-sm text-charcoal-500">{dict.members.events.description}</p>

      <MemberEventsClient
        events={events.map((e) => ({
          id: e.id,
          slugJa: e.slugJa,
          slugEn: e.slugEn,
          titleJa: e.titleJa,
          titleEn: e.titleEn,
          descriptionJa: e.descriptionJa,
          descriptionEn: e.descriptionEn,
          mode: e.mode,
          priceType: e.priceType,
          startsAt: e.startsAt.toISOString(),
          endsAt: e.endsAt.toISOString(),
          onlineUrl: e.onlineUrl,
          venue: e.venue ? { nameJa: e.venue.nameJa, nameEn: e.venue.nameEn } : null,
        }))}
        registeredEventIds={[...registeredEventIds]}
        locale={locale as Locale}
        dict={dict.members.events}
      />
    </div>
  );
}
