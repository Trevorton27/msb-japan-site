"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    __fadeInReady?: boolean;
  }
}

// Must match the selectors in globals.css.
const SELECTOR = "main img, main h1, main h2";

/**
 * Fades in images and section headings as they scroll into view. The hidden
 * starting state comes from the `fade-pending` class that the locale layout
 * sets before first paint; this marks each element `data-fade-in` once it is
 * on screen, which plays the CSS animation.
 */
export function FadeIn() {
  useEffect(() => {
    window.__fadeInReady = true;
    const root = document.documentElement;
    if (!root.classList.contains("fade-pending")) return;

    const intersection = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-fade-in", "");
          intersection.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -5% 0px" }
    );

    function observeNew() {
      document
        .querySelectorAll(`:is(${SELECTOR}):not([data-fade-in])`)
        .forEach((el) => intersection.observe(el));
    }

    // Pick up content rendered after load (client navigation, sliders, etc).
    let frame = 0;
    const mutations = new MutationObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(observeNew);
    });

    // Marking elements before React finishes hydrating a streamed segment
    // causes a hydration mismatch, so wait until the browser is idle.
    function start() {
      observeNew();
      mutations.observe(document.body, { childList: true, subtree: true });
    }
    const hasIdle = typeof window.requestIdleCallback === "function";
    const idle = hasIdle
      ? window.requestIdleCallback(start, { timeout: 1000 })
      : setTimeout(start, 200);

    return () => {
      if (hasIdle) window.cancelIdleCallback(idle as number);
      else clearTimeout(idle);
      cancelAnimationFrame(frame);
      mutations.disconnect();
      intersection.disconnect();
    };
  }, []);

  return null;
}
