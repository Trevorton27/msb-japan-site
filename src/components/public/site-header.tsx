import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { LanguageSwitcher } from "./language-switcher";
import { MobileNav } from "./mobile-nav";
import { NavDropdown } from "./nav-dropdown";
import { auth } from "@/lib/auth";
import { getTeachers } from "@/server/queries/content";

type Dictionary = Record<string, Record<string, string>>;

interface DropdownLink {
  label: string;
  href: string;
}

interface NavItem {
  label: string;
  href: string;
  children?: DropdownLink[];
}

function getNavItems(
  locale: Locale,
  dict: Dictionary,
  teacherLinks: DropdownLink[]
): NavItem[] {
  return [
    { label: dict.common?.home ?? "", href: `/${locale}` },
    {
      label: dict.common?.about ?? "",
      href: `/${locale}/about`,
      children: [
        { label: dict.about?.missionTitle ?? "", href: `/${locale}/about#mission` },
        { label: dict.about?.historyTitle ?? "", href: `/${locale}/about#history` },
        { label: dict.about?.valuesTitle ?? "", href: `/${locale}/about#values` },
        { label: dict.common?.start ?? "", href: `/${locale}/start` },
      ],
    },
    { label: dict.common?.centres ?? "", href: `/${locale}/centres` },
    {
      label: dict.common?.teachers ?? "",
      href: `/${locale}/teachers`,
      children: teacherLinks,
    },
    {
      label: dict.common?.resources ?? "",
      href: undefined as unknown as string,
      children: [
        { label: dict.common?.teachings ?? "", href: `/${locale}/teachings` },
        { label: dict.common?.blog ?? "", href: `/${locale}/blog` },
      ],
    },
    { label: dict.common?.programs ?? "", href: `/${locale}/programs` },
    { label: dict.common?.events ?? "", href: `/${locale}/events` },
    { label: dict.common?.shop ?? "", href: `/${locale}/shop` },
    { label: dict.common?.contact ?? "", href: `/${locale}/contact` },
  ];
}

export async function SiteHeader({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const [session, teachers] = await Promise.all([auth(), getTeachers()]);

  const teacherLinks: DropdownLink[] = teachers.map((t) => {
    const name = locale === "en" && t.nameEn ? t.nameEn : t.nameJa;
    const anchor = locale === "en" && t.slugEn ? t.slugEn : t.slugJa;
    return { label: name, href: `/${locale}/teachers#${anchor}` };
  });

  const navItems = getNavItems(locale, dict, teacherLinks);

  return (
    <header className="sticky top-0 z-40 border-b border-charcoal-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <MobileNav
            items={navItems}
            siteName={dict.common?.siteNameShort ?? ""}
            donateLabel={dict.common?.donate ?? ""}
            donateHref={`/${locale}/donate`}
          />
          <Link
            href={`/${locale}`}
            className="text-lg font-semibold text-charcoal-900"
          >
            {dict.common?.siteNameShort}
          </Link>
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.slice(1).map((item) =>
            item.children ? (
              <NavDropdown
                key={item.label}
                label={item.label}
                href={item.href || undefined}
                items={item.children}
              />
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-charcoal-600 transition-colors hover:bg-ivory-100 hover:text-charcoal-900"
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher locale={locale} />
          <Link
            href={`/${locale}/donate`}
            className="hidden rounded-md bg-burgundy-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-burgundy-600 sm:inline-flex"
          >
            {dict.common?.donate}
          </Link>
          {session?.user && (
            <Link
              href="/admin"
              className="hidden rounded-md border border-charcoal-300 px-3 py-2 text-xs font-medium text-charcoal-600 transition-colors hover:bg-charcoal-100 sm:inline-flex"
            >
              Admin Dashboard
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
