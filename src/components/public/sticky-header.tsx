"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The sticky part of the site header. The secondary bar and the logo row sit
 * above it in normal flow and scroll away on their own, so the header
 * "collapses" without changing the page height (no scroll jump). A sentinel
 * just above the bar tells us when it is stuck, which switches the secondary
 * menu over to its hamburger form.
 */
export function StickyHeader({
  children,
  collapsedSlot,
}: {
  children: React.ReactNode;
  collapsedSlot: React.ReactNode;
}) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry) return;
      setCollapsed(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinelRef} aria-hidden="true" className="h-px" />
      <header
        data-collapsed={collapsed || undefined}
        className="group/header border-charcoal-200 sticky top-0 z-40 border-b bg-[#ede9dc]/95 shadow-none backdrop-blur-sm transition-shadow data-collapsed:shadow-md"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
        <div
          className={`absolute inset-y-0 right-4 hidden items-center transition-opacity duration-300 md:flex ${
            collapsed ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          aria-hidden={!collapsed}
          inert={!collapsed}
        >
          {collapsedSlot}
        </div>
      </header>
    </>
  );
}
