"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { getLabels } from "@/lib/admin-labels";
import {
  subscribeAdminLocale,
  getAdminLocaleSnapshot,
  getAdminLocaleServerSnapshot,
} from "@/lib/admin-locale-store";

export function AdminSidebar() {
  const pathname = usePathname();
  const locale = useSyncExternalStore(
    subscribeAdminLocale,
    getAdminLocaleSnapshot,
    getAdminLocaleServerSnapshot
  );
  const l = getLabels(locale);

  const navItems = [
    { label: l.dashboard, href: "/admin" },
    { label: l.events, href: "/admin/events" },
    { label: l.contacts, href: "/admin/contacts" },
    { label: l.content, href: "/admin/content" },
    { label: l.donations, href: "/admin/donations" },
    { label: l.products, href: "/admin/products" },
    { label: l.orders, href: "/admin/orders" },
    { label: l.social, href: "/admin/social" },
    { label: l.analytics, href: "/admin/analytics" },
    { label: l.redirects, href: "/admin/redirects" },
    { label: l.users, href: "/admin/users" },
    { label: l.settings, href: "/admin/settings" },
  ];

  return (
    <aside className="w-56 shrink-0 border-r bg-white">
      <nav className="flex flex-col gap-1 p-3">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              {item.label}
            </Link>
          );
        })}
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="mt-4 rounded-md border-t px-3 py-2 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
        >
          {l.signOut}
        </button>
      </nav>
    </aside>
  );
}
