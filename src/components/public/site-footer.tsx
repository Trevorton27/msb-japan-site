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
  const links = [
    { label: dict.footer?.organizationInfo ?? "", href: `/${locale}/organization-info` },
    { label: dict.footer?.bylaws ?? "", href: `/${locale}/bylaws` },
    { label: dict.footer?.privacyLink ?? "", href: `/${locale}/privacy` },
    { label: dict.footer?.msbMainSite ?? "", href: "https://www.mangalashribhuti.org", external: true },
  ];

  return (
    <footer className="border-t border-charcoal-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {links.map((link) =>
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-charcoal-500 transition-colors hover:text-charcoal-900"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-charcoal-500 transition-colors hover:text-charcoal-900"
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        <p className="mt-6 text-center text-sm text-charcoal-500">
          &copy; {dict.footer?.copyright}
        </p>
      </div>
    </footer>
  );
}
