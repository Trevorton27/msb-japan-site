"use client";

import { useState } from "react";
import {
  registerForMemberEvent,
  cancelMemberEventRegistration,
} from "@/server/actions/member-event-registrations";
import { t } from "@/lib/locale-utils";
import type { Locale } from "@/lib/i18n/config";

type EventItem = {
  id: string;
  slugJa: string;
  slugEn: string | null;
  titleJa: string;
  titleEn: string | null;
  descriptionJa: string | null;
  descriptionEn: string | null;
  mode: string;
  priceType: string;
  startsAt: string;
  endsAt: string;
  onlineUrl: string | null;
  venue: { nameJa: string; nameEn: string | null } | null;
};

type EventsDictSection = {
  registered: string;
  register: string;
  cancelRegistration: string;
  joinMeeting: string;
  registering: string;
  cancelling: string;
  noEvents: string;
  registrationSuccess: string;
  cancellationSuccess: string;
  error: string;
};

export function MemberEventsClient({
  events,
  registeredEventIds,
  locale,
  dict,
}: {
  events: EventItem[];
  registeredEventIds: string[];
  locale: Locale;
  dict: EventsDictSection;
}) {
  const [registrations, setRegistrations] = useState<Set<string>>(
    () => new Set(registeredEventIds)
  );
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString(locale === "en" ? "en-US" : "ja-JP", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  async function handleRegister(eventId: string) {
    setPending(eventId);
    setError(null);
    const result = await registerForMemberEvent(eventId);
    if (result.success) {
      setRegistrations((prev) => new Set([...prev, eventId]));
    } else {
      setError(dict.error);
    }
    setPending(null);
  }

  async function handleCancel(eventId: string) {
    setPending(eventId);
    setError(null);
    const result = await cancelMemberEventRegistration(eventId);
    if (result.success) {
      setRegistrations((prev) => {
        const next = new Set(prev);
        next.delete(eventId);
        return next;
      });
    } else {
      setError(dict.error);
    }
    setPending(null);
  }

  if (events.length === 0) {
    return (
      <div className="rounded-lg border border-charcoal-200 bg-white p-12 text-center">
        <p className="text-charcoal-400">{dict.noEvents}</p>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}
      <ul className="space-y-4">
        {events.map((event) => {
          const isRegistered = registrations.has(event.id);
          const isPending = pending === event.id;
          const slug = locale === "en" ? (event.slugEn ?? event.slugJa) : event.slugJa;
          const venueName = event.venue
            ? t(locale, event.venue.nameJa, event.venue.nameEn)
            : null;

          return (
            <li key={event.id} className="rounded-lg border border-charcoal-200 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-charcoal-200/60 px-2 py-0.5 text-xs text-charcoal-600">
                      {event.mode}
                    </span>
                    {isRegistered && (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                        {dict.registered}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-charcoal-900">
                    {t(locale, event.titleJa, event.titleEn)}
                  </h3>
                  <p className="mt-1 text-sm text-charcoal-500">
                    {formatDate(event.startsAt)}
                    {venueName && ` · ${venueName}`}
                  </p>
                  {(event.descriptionJa || event.descriptionEn) && (
                    <p className="mt-2 text-sm text-charcoal-600 line-clamp-2">
                      {t(locale, event.descriptionJa, event.descriptionEn)}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {isRegistered ? (
                    <>
                      {event.onlineUrl && (event.mode === "ONLINE" || event.mode === "HYBRID") && (
                        <a
                          href={event.onlineUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-md bg-burgundy-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-burgundy-600"
                        >
                          {dict.joinMeeting}
                        </a>
                      )}
                      <button
                        onClick={() => handleCancel(event.id)}
                        disabled={isPending}
                        className="rounded-md border border-charcoal-200 px-3 py-1.5 text-xs text-charcoal-600 hover:bg-charcoal-200/30 disabled:opacity-50"
                      >
                        {isPending ? dict.cancelling : dict.cancelRegistration}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleRegister(event.id)}
                      disabled={isPending}
                      className="rounded-md bg-burgundy-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-burgundy-600 disabled:opacity-50"
                    >
                      {isPending ? dict.registering : dict.register}
                    </button>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
