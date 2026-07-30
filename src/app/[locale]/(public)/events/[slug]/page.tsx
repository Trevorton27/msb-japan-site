import type { Metadata } from "next";
import Link from "next/link";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { isValidLocale } from "@/lib/i18n/config";
import { notFound } from "next/navigation";
import { getEventBySlug } from "@/server/queries/events";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RegistrationForm } from "@/components/public/registration-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) return {};
  const event = await getEventBySlug(slug, locale as "ja" | "en");
  if (!event) return {};
  const title =
    locale === "en" && event.titleEn ? event.titleEn : event.titleJa;
  return { title: `${title} — MSB Japan` };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) notFound();

  const event = await getEventBySlug(slug, locale as "ja" | "en");
  if (!event) notFound();

  const dict = await getDictionary(locale as Locale);

  const title =
    locale === "en" && event.titleEn ? event.titleEn : event.titleJa;
  const description =
    locale === "en" && event.descriptionEn
      ? event.descriptionEn
      : event.descriptionJa;

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

  const confirmedCount = event.registrations.filter(
    (r) => r.status === "CONFIRMED" || r.status === "PENDING"
  ).length;
  const spotsLeft = event.capacity ? event.capacity - confirmedCount : null;
  const isFull = spotsLeft !== null && spotsLeft <= 0;

  const now = new Date();
  const regOpen =
    (!event.registrationOpensAt || now >= event.registrationOpensAt) &&
    (!event.registrationClosesAt || now <= event.registrationClosesAt);

  const dateOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  };
  const dtLocale = locale === "ja" ? "ja-JP" : "en-US";

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Link
        href={`/${locale}/events`}
        className="text-charcoal-500 hover:text-charcoal-900 text-sm"
      >
        &larr; {dict.events?.title}
      </Link>

      <h1 className="text-charcoal-900 mt-4 text-3xl font-bold">{title}</h1>

      <div className="mt-3 flex flex-wrap gap-2">
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

      <Separator className="my-6" />

      {/* Details */}
      <div className="space-y-3 text-sm">
        <div>
          <span className="text-charcoal-900 font-semibold">
            {dict.events?.date}:
          </span>{" "}
          {event.startsAt.toLocaleDateString(dtLocale, dateOptions)} —{" "}
          {event.endsAt.toLocaleTimeString(dtLocale, {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>

        {event.venue && (
          <div>
            <span className="text-charcoal-900 font-semibold">
              {dict.events?.location}:
            </span>{" "}
            {locale === "en" && event.venue.nameEn
              ? event.venue.nameEn
              : event.venue.nameJa}
            {event.venue.addressJa && locale === "ja" && (
              <span className="text-charcoal-500 ml-1">
                ({event.venue.addressJa})
              </span>
            )}
            {event.venue.addressEn && locale === "en" && (
              <span className="text-charcoal-500 ml-1">
                ({event.venue.addressEn})
              </span>
            )}
          </div>
        )}

        {event.capacity && (
          <div>
            <div className="flex items-center justify-between">
              <span className="text-charcoal-900 font-semibold">
                {dict.events?.capacity}:
              </span>
              <span
                className={
                  isFull ? "text-burgundy-600 font-medium" : "text-charcoal-600"
                }
              >
                {isFull
                  ? dict.events?.full
                  : (dict.events?.spotsLeft?.replace(
                      "{count}",
                      String(spotsLeft)
                    ) ?? `${spotsLeft} spots left`)}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-3">
              <div className="bg-ivory-100 h-2 flex-1 overflow-hidden rounded-full">
                <div
                  className={`h-full rounded-full ${isFull ? "bg-burgundy-500" : "bg-saffron-500"}`}
                  style={{
                    width: `${Math.min(100, Math.round((confirmedCount / event.capacity) * 100))}%`,
                  }}
                />
              </div>
              <span className="text-charcoal-500 text-xs whitespace-nowrap">
                {(dict.events?.registeredCount ?? "{count} registered").replace(
                  "{count}",
                  String(confirmedCount)
                )}{" "}
                / {event.capacity}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      {description && (
        <div className="text-charcoal-600 mt-6 leading-relaxed whitespace-pre-wrap">
          {description}
        </div>
      )}

      {/* Calendar download */}
      <div className="mt-6">
        <a
          href={`/api/events/${event.id}/calendar`}
          className="text-burgundy-500 text-sm hover:underline"
        >
          {dict.events?.addToCalendar}
        </a>
      </div>

      <Separator className="my-8" />

      {/* Registration */}
      <section>
        <h2 className="text-charcoal-900 mb-4 text-xl font-semibold">
          {dict.events?.register}
        </h2>

        {!regOpen ? (
          <p className="text-charcoal-500">{dict.events?.registrationClosed}</p>
        ) : (
          <>
            {isFull && (
              <p className="border-saffron-500/40 bg-ivory-100 text-charcoal-600 mb-4 rounded-md border px-4 py-3 text-sm">
                {dict.events?.waitlistNotice ??
                  "This event is full. New registrations will be added to the waitlist."}
              </p>
            )}
            <RegistrationForm
              eventId={event.id}
              labels={{
                email: dict.contact?.email ?? "Email",
                attendeeName: dict.events?.attendeeName ?? "Name",
                attendeeEmail: dict.events?.attendeeEmail ?? "Email",
                addAttendee: dict.events?.addAttendee ?? "Add",
                removeAttendee: dict.events?.removeAttendee ?? "Remove",
                registrationNotes: dict.events?.registrationNotes ?? "Notes",
                registerSuccess:
                  dict.events?.registerSuccess ?? "Registration confirmed.",
                registerWaitlisted:
                  dict.events?.registerWaitlisted ?? "Added to waitlist.",
                registerError:
                  dict.events?.registerError ?? "Registration failed.",
                register: isFull
                  ? (dict.events?.joinWaitlist ?? "Join waitlist")
                  : (dict.events?.register ?? "Register"),
              }}
            />
          </>
        )}
      </section>
    </div>
  );
}
