"use client";

import { useState } from "react";
import Link from "next/link";

interface DropdownLink {
  label: string;
  href: string;
}

export function NavDropdown({
  label,
  href,
  items,
}: {
  label: string;
  href?: string;
  items: DropdownLink[];
}) {
  const [open, setOpen] = useState(false);

  const sharedClassName =
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
        <Link href={href} className={sharedClassName}>
          {label}
          {chevron}
        </Link>
      ) : (
        <button type="button" className={sharedClassName}>
          {label}
          {chevron}
        </button>
      )}
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 min-w-[180px] rounded-md border border-charcoal-200 bg-white py-1 shadow-lg">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-4 py-2 text-sm text-charcoal-600 transition-colors hover:bg-ivory-100 hover:text-charcoal-900"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
