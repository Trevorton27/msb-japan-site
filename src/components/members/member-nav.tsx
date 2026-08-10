"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type NavUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export function MemberNav({
  locale,
  dict,
  user,
}: {
  locale: Locale;
  dict: Dictionary;
  user: NavUser;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const n = dict.members.nav;

  const navItems = [
    { label: n.dashboard, href: `/${locale}/members` },
    { label: n.study, href: `/${locale}/members/study` },
    { label: n.events, href: `/${locale}/members/events` },
    { label: n.sangha, href: `/${locale}/members/sangha` },
    { label: n.account, href: `/${locale}/members/account` },
  ];

  function isActive(href: string) {
    if (href === `/${locale}/members`) return pathname === href;
    return pathname.startsWith(href);
  }

  return (
    <>
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-charcoal-200 bg-ivory-50">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              className="rounded-md p-1.5 text-charcoal-600 hover:bg-charcoal-200/50 md:hidden"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
            <Link
              href={`/${locale}/members`}
              className="text-sm font-semibold tracking-wide text-charcoal-900"
            >
              {n.portal}
            </Link>
          </div>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-burgundy-500 text-white"
                    : "text-charcoal-600 hover:bg-charcoal-200/50 hover:text-charcoal-900"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <span className="text-xs text-charcoal-500">{user.name ?? user.email}</span>
            <button
              onClick={() => signOut({ callbackUrl: `/${locale}/members/sign-in` })}
              className="rounded-md px-2 py-1 text-xs text-charcoal-500 hover:text-charcoal-900"
            >
              {dict.common.logout ?? "Logout"}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-charcoal-900/30"
            onClick={() => setMobileOpen(false)}
          />
          <nav className="absolute left-0 top-0 flex h-full w-64 flex-col bg-ivory-50 shadow-lg">
            <div className="flex items-center justify-between border-b px-4 py-4">
              <span className="text-sm font-semibold text-charcoal-900">{n.portal}</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded p-1 text-charcoal-500"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex flex-1 flex-col gap-1 p-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-burgundy-500 text-white"
                      : "text-charcoal-600 hover:bg-charcoal-200/50"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="border-t p-4 text-xs text-charcoal-500">
              <p className="mb-2">{user.name ?? user.email}</p>
              <button
                onClick={() => signOut({ callbackUrl: `/${locale}/members/sign-in` })}
                className="text-charcoal-500 hover:text-charcoal-900"
              >
                {dict.common.logout ?? "Logout"}
              </button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
