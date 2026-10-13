import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { MobileNav } from "./mobile-nav";
import { NavDropdown } from "./nav-dropdown";
import type { DropdownChild } from "./nav-dropdown";
import { SecondaryMenuBar, SecondaryMenuHamburger } from "./secondary-menu";
import type { SecondaryMenuLabels } from "./secondary-menu";
import { SiteSearch } from "./site-search";
import { StickyHeader } from "./sticky-header";


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

// The organisation's names are shown together in the header lockup on both
// locales, as on the US site.
function BrandText({
  name,
  legalName,
  compact = false,
}: {
  name: string;
  legalName: string;
  compact?: boolean;
}) {
  return (
    <span className="flex flex-col items-center font-brand md:items-start">
      <span
        className={
          compact
            ? "text-base leading-tight text-navy-800"
            : "text-[1.35rem] leading-tight text-navy-800 md:text-[1.9rem]"
        }
      >
        {name}
      </span>
      {!compact && (
        <span className="mt-1 text-[0.7rem] font-light tracking-[0.12em] text-charcoal-500 md:text-[0.8rem]">
          {legalName}
        </span>
      )}
    </span>
  );
}

export function SiteHeader({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const navItems = getNavItems(locale, dict);
  const c = dict.common;
  const brand = { name: c.siteName, legalName: c.siteNameLegal };
  const secondaryLabels: SecondaryMenuLabels = {
    memberPortal: dict.members.nav.portal,
    donate: c.donate,
    adminDashboard: c.adminDashboard,
    menu: c.menu,
    search: {
      label: dict.search.label,
      placeholder: dict.search.placeholder,
      submit: dict.search.submit,
    },
  };

  return (
    <>
      {/* Secondary menu + logo lockup: scroll away above the sticky bar */}
      <div className="bg-[#ede9dc]">
        <div className="hidden bg-navy-800 md:block">
          <SecondaryMenuBar locale={locale} labels={secondaryLabels} />
        </div>
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 md:py-6 lg:px-8">
          <Link
            href={`/${locale}`}
            className="mx-auto flex w-fit flex-col items-center gap-3 md:flex-row md:gap-5"
          >
            <img
              src="/images/msbLogo.png"
              alt=""
              width={110}
              height={117}
              className="h-20 w-auto shrink-0 md:h-24"
            />
            <BrandText {...brand} />
          </Link>
        </div>
      </div>

      <StickyHeader
        collapsedSlot={
          <SecondaryMenuHamburger locale={locale} labels={secondaryLabels} />
        }
      >
        {/* Mobile bar */}
        <div className="flex items-center justify-between py-2 md:hidden">
          <MobileNav
            items={navItems}
            siteName={c.siteName}
            locale={locale}
            secondaryLabels={secondaryLabels}
          />
          <Link
            href={`/${locale}`}
            className="opacity-0 transition-opacity duration-300 group-data-collapsed/header:opacity-100"
            tabIndex={-1}
          >
            <BrandText {...brand} compact />
          </Link>
          <SiteSearch locale={locale} labels={secondaryLabels.search} />
        </div>

        {/* Desktop main menu */}
        <nav className="hidden flex-wrap items-center justify-center gap-x-4 py-2 md:flex md:px-20 lg:gap-x-8">
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
        </nav>
      </StickyHeader>
    </>
  );
}
