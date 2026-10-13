"use client";

import { useEffect, useState } from "react";

// Collapsing shrinks the sticky header, which shifts the page and (with scroll
// anchoring) moves scrollY by roughly the collapsed height. The gap between the
// two thresholds must exceed that height or the header flickers open/closed.
const COLLAPSE_AT = 260;
const EXPAND_AT = 10;

export function CollapsibleHeader({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    let frame = 0;
    function update() {
      frame = 0;
      const y = window.scrollY;
      setCollapsed((prev) =>
        prev ? y > EXPAND_AT : y > COLLAPSE_AT
      );
    }
    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update);
    }
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header
      data-collapsed={collapsed}
      className="group sticky top-0 z-40 border-b border-charcoal-200 shadow-sm"
    >
      {children}
    </header>
  );
}
