import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { LanguageSwitcher } from "./language-switcher";
import { MobileNav } from "./mobile-nav";
import { NavDropdown } from "./nav-dropdown";
import type { DropdownChild } from "./nav-dropdown";
import { auth } from "@/lib/auth";
import { getTeachers } from "@/server/queries/content";

interface NavItem {
  label: string;
  href: string;
  children?: DropdownChild[];
}

function getNavItems(
  locale: Locale,
  dict: Dictionary,
  teacherLinks: { label: string; href: string }[]
): NavItem[] {
  const c = dict.common ?? {};
  return [
    {
      label: c.about ?? "",
      href: `/${locale}/about`,
      children: [
        {
          label: c.teachersAndLineage ?? "",
          href: `/${locale}/teachers`,
          children: teacherLinks,
        },
        {
          label: c.visionAndMission ?? "",
          href: `/${locale}/vision`,
          children: [
            { label: c.vision ?? "", href: `/${locale}/vision` },
            { label: c.visionForJapan ?? "", href: `/${locale}/vision#japan` },
            { label: c.sangha ?? "", href: `/${locale}/vision#sangha` },
          ],
        },
        { label: c.ourHistory ?? "", href: `/${locale}/history` },
        {
          label: c.centresAndShrineRooms ?? "",
          href: `/${locale}/centres`,
          children: [
            { label: c.kyoto ?? "", href: `/${locale}/centres#kyoto` },
            { label: c.izu ?? "", href: `/${locale}/centres#izu` },
          ],
        },
      ],
    },
    {
      label: c.programsAndStudy ?? "",
      href: `/${locale}/programs`,
      children: [
        {
          label: c.publicPrograms ?? "",
          href: `/${locale}/programs`,
          children: [
            { label: c.lineageCourses ?? "", href: `/${locale}/programs#lineage-courses` },
            { label: c.onlineStudyGroup ?? "", href: `/${locale}/programs#online-study-group` },
          ],
        },
        {
          label: c.weeklyGatherings ?? "",
          href: `/${locale}/gatherings`,
          children: [
            { label: c.theNyington ?? "", href: `/${locale}/gatherings#nyington` },
            { label: c.localStudy ?? "", href: `/${locale}/gatherings#local-study` },
          ],
        },
        {
          label: c.memberPrograms ?? "",
          href: `/${locale}/member-programs`,
          children: [
            { label: c.ngondro ?? "", href: `/${locale}/member-programs#ngondro` },
            { label: c.shedra ?? "", href: `/${locale}/member-programs#shedra` },
            { label: c.nss ?? "", href: `/${locale}/member-programs#nss` },
          ],
        },
      ],
    },
    {
      label: c.resources ?? "",
      href: undefined as unknown as string,
      children: [
        { label: c.dharmaBlog ?? "", href: `/${locale}/blog` },
        { label: c.foundationalTeachings ?? "", href: `/${locale}/teachings` },
        { label: c.videos ?? "", href: `/${locale}/teachings#videos` },
        { label: c.booksAndPublications ?? "", href: `/${locale}/shop` },
      ],
    },
    { label: c.calendarAndEvents ?? "", href: `/${locale}/events` },
    {
      label: c.contactAndJoin ?? "",
      href: `/${locale}/contact`,
      children: [
        { label: c.howToJoin ?? "", href: `/${locale}/start` },
        { label: c.contact ?? "", href: `/${locale}/contact` },
      ],
    },
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

  const teacherLinks = teachers.map((t) => {
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
          {navItems.map((item) =>
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
