"use client";

import { useEffect, useRef, useState } from "react";
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
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Delay closing so a slow or diagonal mouse move from the trigger into the
  // panel doesn't dismiss the menu.
  function cancelClose() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }
  function openNow() {
    cancelClose();
    setOpen(true);
  }
  function closeSoon() {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 400);
  }
  useEffect(() => cancelClose, []);

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
      onMouseEnter={openNow}
      onMouseLeave={closeSoon}
      onFocus={openNow}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null))
          closeSoon();
      }}
    >
      {href ? (
        <Link href={href} className={triggerClass}>
          {label}
          {chevron}
        </Link>
      ) : (
        <button
          type="button"
          className={triggerClass}
          aria-expanded={open}
          onClick={() => (open ? setOpen(false) : openNow())}
        >
          {label}
          {chevron}
        </button>
      )}
      {open && (
        <div className="absolute top-full left-0 z-50 pt-1">
          <div
            className={`border-charcoal-200 rounded-md border bg-[#ede9dc] py-1 shadow-lg ${hasGroups ? "min-w-[220px]" : "min-w-[180px]"}`}
          >
            {items.map((item, idx) => {
              const isGroup = item.children && item.children.length > 0;
              const addDivider = idx > 0 && isGroup;
              return (
                <div
                  key={item.href}
                  className={
                    addDivider ? "border-charcoal-100 mt-1 border-t pt-1" : ""
                  }
                >
                  {isGroup ? (
                    <>
                      <Link
                        href={item.href}
                        className="text-charcoal-400 hover:text-charcoal-700 block px-4 py-1.5 text-xs font-semibold tracking-wider uppercase transition-colors"
                      >
                        {item.label}
                      </Link>
                      {item.children!.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="text-charcoal-600 hover:bg-ivory-100 hover:text-charcoal-900 block px-6 py-1.5 text-sm transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-charcoal-600 hover:bg-ivory-100 hover:text-charcoal-900 block px-4 py-2 text-sm transition-colors"
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
