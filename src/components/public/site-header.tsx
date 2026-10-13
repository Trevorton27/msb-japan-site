import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { LanguageSwitcher } from "./language-switcher";
import { MobileNav } from "./mobile-nav";
import { NavDropdown } from "./nav-dropdown";
import type { DropdownChild } from "./nav-dropdown";
import { AdminLink } from "./admin-link";
import { CollapsibleHeader } from "./collapsible-header";

interface NavItem {
  label: string;
  href: string;
  children?: DropdownChild[];
}

function getNavItems(locale: Locale, dict: Dictionary): NavItem[] {
  const c = dict.common ?? {};
  const l = (path: string) => `/${locale}${path}`;
  const postSlug = (ja: string, en: string) => (locale === "en" ? en : ja);
  return [
    {
      label: c.about ?? "",
      href: l("/about"),
      children: [
        { label: c.vision ?? "", href: l("/vision#vision") },
        { label: c.visionForJapan ?? "", href: l("/vision#japan") },
        { label: c.sangha ?? "", href: l("/vision#sangha") },
        { label: c.ourCenters ?? "", href: l("/centres") },
        { label: c.supportAndDonations ?? "", href: l("/donate") },
        { label: c.organizationOverview ?? "", href: l("/organization-info") },
      ],
    },
    {
      label: c.lineage ?? "",
      href: l("/lineage"),
      children: [
        { label: c.teachers ?? "", href: l("/teachers") },
        { label: c.whatIsBuddhism ?? "", href: l("/lineage/buddhism") },
        { label: c.tibetanBuddhism ?? "", href: l("/lineage/tibetan-buddhism") },
        { label: c.nyingma ?? "", href: l("/lineage/nyingma") },
        { label: c.longchenNyingtik ?? "", href: l("/lineage/longchen-nyingtik") },
      ],
    },
    {
      label: c.programs ?? "",
      href: l("/programs"),
      children: [
        { label: c.teachingsAndRetreats ?? "", href: l("/programs#teachings-retreats") },
        { label: c.inPersonGatherings ?? "", href: l("/programs#in-person") },
        { label: c.onlineLineageCourse ?? "", href: l("/programs#online-lineage-course") },
        { label: c.tsokOffering ?? "", href: l("/programs#tsok") },
        { label: c.compassionateActivity ?? "", href: l("/programs#compassionate-activity") },
      ],
    },
    {
      label: c.resources ?? "",
      href: undefined as unknown as string,
      children: [
        {
          label: c.msbjLink ?? "",
          href: l(`/teachings/${postSlug("msbj-link", "msbj-link-en")}`),
        },
        { label: c.dharmaArticles ?? "", href: l("/blog") },
        { label: c.videoAudioArchive ?? "", href: l("/videos") },
        { label: c.storeAndPublications ?? "", href: l("/shop") },
      ],
    },
    { label: c.calendar ?? "", href: l("/events") },
    { label: c.contact ?? "", href: l("/contact") },
  ];
}

export function SiteHeader({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const navItems = getNavItems(locale, dict);

  return (
    <CollapsibleHeader>
      {/* Utility bar */}
      <div className="bg-navy-800 text-white">
        <div className="mx-auto flex h-11 max-w-7xl items-stretch justify-end px-4 sm:px-6 lg:px-8">
          <div className="mr-auto flex items-center md:hidden">
            <MobileNav
              items={navItems}
              siteName={dict.common?.siteNameShort ?? ""}
              donateLabel={dict.common?.donate ?? ""}
              donateHref={`/${locale}/donate`}
              membersLabel={dict.members?.nav?.portal ?? ""}
              membersHref={`/${locale}/members`}
              triggerClassName="-ml-2 inline-flex items-center justify-center rounded-md p-2 text-white/90 hover:bg-navy-700 hover:text-white md:hidden"
            />
          </div>
          <LanguageSwitcher
            locale={locale}
            className="flex items-center px-4 text-sm font-medium text-white/90 transition-colors hover:bg-navy-700 hover:text-white"
          />
          <Link
            href={`/${locale}/members`}
            className="hidden items-center px-4 text-sm font-medium text-white/90 transition-colors hover:bg-navy-700 hover:text-white md:flex"
          >
            {dict.members?.nav?.portal ?? "Members"}
          </Link>
          <Link
            href={`/${locale}/donate`}
            className="hidden items-center bg-burgundy-500 px-6 text-sm font-bold text-white transition-colors hover:bg-burgundy-600 md:flex"
          >
            {dict.common?.donate}
          </Link>
          {/* Search is not wired up yet. */}
          <button
            type="button"
            className="flex items-center px-4 text-white/90 transition-colors hover:bg-navy-700 hover:text-white"
            aria-label={locale === "ja" ? "検索" : "Search"}
          >
            <svg
              className="h-[18px] w-[18px]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </button>
          <AdminLink className="hidden items-center px-4 text-xs font-medium text-white/80 transition-colors hover:bg-navy-700 hover:text-white md:flex" />
        </div>
      </div>

      {/* Logo row — folds away once the page is scrolled */}
      <div className="grid grid-rows-[1fr] bg-[#ede9dc]/95 backdrop-blur-sm transition-[grid-template-rows] duration-300 ease-out group-data-[collapsed=true]:grid-rows-[0fr]">
        <div className="overflow-hidden">
          <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-5 transition-opacity duration-300 group-data-[collapsed=true]:opacity-0 sm:px-6 lg:px-8">
            <Link
              href={`/${locale}`}
              className="flex flex-col items-center"
              tabIndex={-1}
            >
              <img
                src="/images/msbLogo.png"
                alt=""
                className="h-16 w-auto md:h-24"
              />
            </Link>
            <Link
              href={`/${locale}`}
              className="mt-2 flex flex-col items-center text-center"
            >
              <span className="font-serif text-xl font-semibold tracking-wide text-navy-800 sm:text-2xl md:text-4xl">
                {dict.common?.siteName}
              </span>
              <span className="mt-1 text-[11px] tracking-[0.25em] text-charcoal-500 sm:text-sm">
                {dict.common?.siteNameLegal}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Nav row */}
      <nav className="hidden border-t border-charcoal-200 bg-ivory-50 md:block">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-4 px-4 py-2 sm:px-6 lg:px-8 lg:gap-x-8">
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
                className="rounded-md px-3 py-2 text-base text-charcoal-600 transition-colors hover:text-navy-800"
              >
                {item.label}
              </Link>
            )
          )}
        </div>
      </nav>
    </CollapsibleHeader>
  );
}
