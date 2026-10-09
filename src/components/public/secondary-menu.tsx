"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MenuIcon } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { LanguageSwitcher } from "./language-switcher";
import { AdminLink } from "./admin-link";
import { SiteSearch } from "./site-search";
import type { SearchLabels } from "./site-search";

export interface SecondaryMenuLabels {
  memberPortal: string;
  donate: string;
  adminDashboard: string;
  menu: string;
  search: SearchLabels;
}

const barItem =
  "flex items-center bg-[#e2ddcd] px-4 py-2.5 text-[13px] font-semibold tracking-wide text-charcoal-600 transition-colors hover:bg-[#d6d0bc] hover:text-charcoal-900";

/** The always-visible top-right bar (desktop, page scrolled to the top). */
export function SecondaryMenuBar({
  locale,
  labels,
}: {
  locale: Locale;
  labels: SecondaryMenuLabels;
}) {
  return (
    <nav
      aria-label="Secondary"
      className="flex items-stretch justify-end gap-0.5"
    >
      <LanguageSwitcher locale={locale} className={barItem} />
      <Link href={`/${locale}/members`} className={barItem}>
        {labels.memberPortal}
      </Link>
      <Link
        href={`/${locale}/donate`}
        className="flex items-center bg-burgundy-500 px-4 py-2.5 text-[13px] font-semibold tracking-wide text-white transition-colors hover:bg-burgundy-600"
      >
        {labels.donate}
      </Link>
      <AdminLink label={labels.adminDashboard} className={barItem} />
      <SiteSearch
        locale={locale}
        labels={labels.search}
        triggerClassName={`${barItem} justify-center`}
      />
    </nav>
  );
}

const dropdownItem =
  "block px-4 py-2 text-sm text-charcoal-600 transition-colors hover:bg-ivory-100 hover:text-charcoal-900";

/** Hamburger version of the secondary menu, shown once the header collapses. */
export function SecondaryMenuHamburger({
  locale,
  labels,
}: {
  locale: Locale;
  labels: SecondaryMenuLabels;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div ref={ref} className="relative flex items-center gap-1">
      <SiteSearch locale={locale} labels={labels.search} />
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={labels.menu}
        className="inline-flex items-center justify-center rounded-md p-2 text-charcoal-600 transition-colors hover:bg-ivory-100 hover:text-charcoal-900"
      >
        <MenuIcon className="h-5 w-5" aria-hidden="true" />
      </button>
      {open && (
        <div className="absolute top-full right-0 z-50 mt-1 min-w-[200px] rounded-md border border-charcoal-200 bg-[#ede9dc] py-1 shadow-lg">
          <LanguageSwitcher
            locale={locale}
            className={dropdownItem}
            onNavigate={close}
          />
          <Link
            href={`/${locale}/members`}
            onClick={close}
            className={dropdownItem}
          >
            {labels.memberPortal}
          </Link>
          <Link
            href={`/${locale}/donate`}
            onClick={close}
            className={`${dropdownItem} font-semibold text-burgundy-500`}
          >
            {labels.donate}
          </Link>
          <AdminLink
            label={labels.adminDashboard}
            className={dropdownItem}
            onClick={close}
          />
        </div>
      )}
    </div>
  );
}
