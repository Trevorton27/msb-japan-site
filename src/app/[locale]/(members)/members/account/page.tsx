import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isValidLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { getCurrentUser } from "@/lib/auth/rbac";
import { getMemberEventRegistrations } from "@/server/queries/member-events";
import { t } from "@/lib/admin-locale";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

function formatDate(date: Date, locale: string) {
  return date.toLocaleDateString(locale === "en" ? "en-US" : "ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const STATUS_COLORS: Record<string, string> = {
  REGISTERED: "bg-green-100 text-green-700",
  WAITLISTED: "bg-yellow-100 text-yellow-700",
  CANCELLED: "bg-gray-100 text-gray-500",
  ATTENDED: "bg-blue-100 text-blue-700",
};

export default async function MemberAccountPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const dict = await getDictionary(locale as Locale);
  const a = dict.members.account;
  const user = await getCurrentUser();

  if (!user) notFound();

  const registrations = await getMemberEventRegistrations(user.id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-2xl font-semibold text-charcoal-900">{a.title}</h1>

      {/* Profile */}
      <section className="mb-6 rounded-lg border border-charcoal-200 bg-white p-5">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-charcoal-500">
          {a.profile}
        </h2>
        <dl className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <dt className="text-sm font-medium text-charcoal-500">{a.name}</dt>
            <dd className="col-span-2 text-sm text-charcoal-900">{user.name ?? "—"}</dd>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <dt className="text-sm font-medium text-charcoal-500">{a.email}</dt>
            <dd className="col-span-2 text-sm text-charcoal-900">{user.email}</dd>
          </div>
        </dl>
      </section>

      {/* Membership status */}
      <section className="mb-6 rounded-lg border border-charcoal-200 bg-white p-5">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-charcoal-500">
          {a.membership}
        </h2>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
            {a.memberStatus}
          </span>
        </div>
      </section>

      {/* Event registrations */}
      <section className="rounded-lg border border-charcoal-200 bg-white p-5">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-charcoal-500">
          {a.registrations}
        </h2>
        {registrations.length > 0 ? (
          <ul className="space-y-3">
            {registrations.map((reg) => (
              <li
                key={reg.id}
                className="flex items-start justify-between gap-3 border-b border-charcoal-100 pb-3 last:border-0 last:pb-0"
              >
                <div>
                  <p className="text-sm font-medium text-charcoal-900">
                    {t(locale as Locale, reg.event.titleJa, reg.event.titleEn)}
                  </p>
                  <p className="mt-0.5 text-xs text-charcoal-400">
                    {formatDate(reg.event.startsAt, locale)}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                    STATUS_COLORS[reg.status] ?? "bg-gray-100 text-gray-600"
                  }`}
                >
                  {reg.status}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-charcoal-400">{a.noRegistrations}</p>
        )}
      </section>
    </div>
  );
}
