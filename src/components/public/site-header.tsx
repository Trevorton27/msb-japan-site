import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { LanguageSwitcher } from "./language-switcher";
import { MobileNav } from "./mobile-nav";
import { NavDropdown } from "./nav-dropdown";
import type { DropdownChild } from "./nav-dropdown";
import { AdminLink } from "./admin-link";

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
    { label: c.home ?? "", href: l("") },
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
      ],
    },
    { label: c.storeAndPublications ?? "", href: l("/shop") },
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
    <header className="sticky top-0 z-40 border-b border-charcoal-200 bg-[#ede9dc]/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Logo row */}
        <div className="relative flex items-center justify-center py-4">
          <div className="absolute left-0 flex items-center md:hidden">
            <MobileNav
              items={navItems}
              siteName={dict.common?.siteNameShort ?? ""}
              donateLabel={dict.common?.donate ?? ""}
              donateHref={`/${locale}/donate`}
              membersLabel={dict.members?.nav?.portal ?? ""}
              membersHref={`/${locale}/members`}
            />
          </div>
          <div className="absolute right-0 flex items-center md:hidden">
            <LanguageSwitcher locale={locale} />
          </div>
          <Link href={`/${locale}`}>
            <img
              src="/images/msbLogo.png"
              alt={dict.common?.siteNameShort ?? "MSB"}
              className="h-24 w-auto"
            />
          </Link>
        </div>

        {/* Nav row */}
        <nav className="hidden flex-wrap items-center justify-center gap-1 border-t border-charcoal-100 py-2 md:flex">
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
          <div className="ml-auto flex items-center gap-3">
            <LanguageSwitcher locale={locale} />
            <Link
              href={`/${locale}/members`}
              className="rounded-md border border-charcoal-300 px-3 py-2 text-sm font-medium text-charcoal-600 transition-colors hover:bg-charcoal-100"
            >
              {dict.members?.nav?.portal ?? "Members"}
            </Link>
            <Link
              href={`/${locale}/donate`}
              className="rounded-md bg-burgundy-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-burgundy-600"
            >
              {dict.common?.donate}
            </Link>
            <AdminLink />
          </div>
        </nav>
      </div>
    </header>
  );
}
