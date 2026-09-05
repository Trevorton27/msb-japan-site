"use client";

import { useState } from "react";
import Link from "next/link";

export interface DropdownChild {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

export function NavDropdown({
  label,
  href,
  items,
}: {
  label: string;
  href?: string;
  items: DropdownChild[];
}) {
  const [open, setOpen] = useState(false);

  const hasGroups = items.some((i) => i.children && i.children.length > 0);

  const triggerClass =
    "flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-charcoal-600 transition-colors hover:bg-ivory-100 hover:text-charcoal-900";

  const chevron = (
    <svg
      className="h-3 w-3 transition-transform"
      style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 4l4 4 4-4" />
    </svg>
  );

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {href ? (
        <Link href={href} className={triggerClass}>
          {label}
          {chevron}
        </Link>
      ) : (
        <button type="button" className={triggerClass}>
          {label}
          {chevron}
        </button>
      )}
      {open && (
        <div
          className={`absolute left-0 top-full z-50 mt-1 rounded-md border border-charcoal-200 bg-[#ede9dc] py-1 shadow-lg ${hasGroups ? "min-w-[220px]" : "min-w-[180px]"}`}
        >
          {items.map((item, idx) => {
            const isGroup = item.children && item.children.length > 0;
            const addDivider = idx > 0 && isGroup;
            return (
              <div
                key={item.href}
                className={addDivider ? "mt-1 border-t border-charcoal-100 pt-1" : ""}
              >
                {isGroup ? (
                  <>
                    <Link
                      href={item.href}
                      className="block px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-charcoal-400 transition-colors hover:text-charcoal-700"
                    >
                      {item.label}
                    </Link>
                    {item.children!.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-6 py-1.5 text-sm text-charcoal-600 transition-colors hover:bg-ivory-100 hover:text-charcoal-900"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className="block px-4 py-2 text-sm text-charcoal-600 transition-colors hover:bg-ivory-100 hover:text-charcoal-900"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
