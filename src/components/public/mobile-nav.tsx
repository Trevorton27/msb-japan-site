"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

interface NavItem {
  label: string;
  href: string;
}

export function MobileNav({
  items,
  siteName,
}: {
  items: NavItem[];
  siteName: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className="inline-flex items-center justify-center rounded-md p-2 text-charcoal-600 hover:bg-ivory-100 hover:text-charcoal-900 md:hidden"
        aria-label="Open menu"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <SheetTitle className="text-lg font-semibold">{siteName}</SheetTitle>
        <nav className="mt-6 flex flex-col gap-1">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-base font-medium text-charcoal-600 transition-colors hover:bg-ivory-100 hover:text-charcoal-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
