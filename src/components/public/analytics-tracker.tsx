"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function send(event: string, path: string) {
  fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event, path }),
  }).catch(() => {});
}

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    send("page_view", pathname);
  }, [pathname]);

  // Send heartbeat every 30s so the admin can see current visitors
  useEffect(() => {
    send("heartbeat", pathname);
    const interval = setInterval(() => send("heartbeat", pathname), 30_000);
    return () => clearInterval(interval);
  }, [pathname]);

  return null;
}
