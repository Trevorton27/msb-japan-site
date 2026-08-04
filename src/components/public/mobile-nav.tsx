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
  children?: { label: string; href: string }[];
}

export function MobileNav({
  items,
  siteName,
  donateLabel,
  donateHref,
}: {
  items: NavItem[];
  siteName: string;
  donateLabel: string;
  donateHref: string;
}) {
  const [open, setOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  function toggleExpanded(label: string) {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  }

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
            <div key={item.label}>
              {item.children ? (
                <>
                  <div className="flex items-center">
                    {item.href ? (
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="flex-1 rounded-md px-3 py-2 text-base font-medium text-charcoal-600 transition-colors hover:bg-ivory-100 hover:text-charcoal-900"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <span className="flex-1 px-3 py-2 text-base font-medium text-charcoal-600">
                        {item.label}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => toggleExpanded(item.label)}
                      className="rounded-md p-2 text-charcoal-400 hover:bg-ivory-100 hover:text-charcoal-900"
                      aria-label={`Expand ${item.label}`}
                    >
                      <svg
                        className="h-4 w-4 transition-transform"
                        style={{
                          transform: expandedItems.has(item.label)
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                        }}
                        viewBox="0 0 12 12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M2 4l4 4 4-4" />
                      </svg>
                    </button>
                  </div>
                  {expandedItems.has(item.label) && (
                    <div className="ml-4 flex flex-col gap-0.5 border-l border-charcoal-200 pl-3">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setOpen(false)}
                          className="rounded-md px-3 py-1.5 text-sm text-charcoal-500 transition-colors hover:bg-ivory-100 hover:text-charcoal-900"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-2 text-base font-medium text-charcoal-600 transition-colors hover:bg-ivory-100 hover:text-charcoal-900"
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}

          <div className="mt-4 border-t border-charcoal-200 pt-4">
            <Link
              href={donateHref}
              onClick={() => setOpen(false)}
              className="block rounded-md bg-burgundy-500 px-3 py-2 text-center text-base font-medium text-white transition-colors hover:bg-burgundy-600"
            >
              {donateLabel}
            </Link>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
