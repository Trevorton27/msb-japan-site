import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";

type Dictionary = Record<string, Record<string, string>>;

export function SiteFooter({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const footerLinks = [
    { label: dict.footer?.aboutLink ?? "", href: `/${locale}/about` },
    { label: dict.footer?.centresLink ?? "", href: `/${locale}/centres` },
    { label: dict.footer?.teachersLink ?? "", href: `/${locale}/teachers` },
    { label: dict.footer?.eventsLink ?? "", href: `/${locale}/events` },
    { label: dict.footer?.contactLink ?? "", href: `/${locale}/contact` },
    { label: dict.footer?.donateLink ?? "", href: `/${locale}/donate` },
  ];

  return (
    <footer className="border-t border-charcoal-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="text-lg font-semibold text-charcoal-900">
              {dict.common?.siteNameShort}
            </p>
            <p className="mt-2 text-sm text-charcoal-500">
              {dict.footer?.tagline}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-charcoal-900">
              {dict.common?.siteName}
            </h3>
            <ul className="mt-3 space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-charcoal-500 transition-colors hover:text-charcoal-900"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-charcoal-900">
              {dict.common?.learnMore}
            </h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href={`/${locale}/start`}
                  className="text-sm text-charcoal-500 transition-colors hover:text-charcoal-900"
                >
                  {dict.common?.start}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/teachings`}
                  className="text-sm text-charcoal-500 transition-colors hover:text-charcoal-900"
                >
                  {dict.common?.teachings}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-charcoal-900">
              {dict.footer?.privacyLink}
            </h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href={`/${locale}/privacy`}
                  className="text-sm text-charcoal-500 transition-colors hover:text-charcoal-900"
                >
                  {dict.footer?.privacyLink}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/tokushoho`}
                  className="text-sm text-charcoal-500 transition-colors hover:text-charcoal-900"
                >
                  {dict.footer?.tokushoho}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-charcoal-200 pt-8 text-center text-sm text-charcoal-500">
          &copy; {new Date().getFullYear()} {dict.footer?.copyright}
        </div>
      </div>
    </footer>
  );
}
