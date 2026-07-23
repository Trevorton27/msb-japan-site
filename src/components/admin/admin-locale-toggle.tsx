"use client";

import { useRouter } from "next/navigation";
import { useSyncExternalStore, useTransition } from "react";
import {
  subscribeAdminLocale,
  getAdminLocaleSnapshot,
  getAdminLocaleServerSnapshot,
  setAdminLocale,
} from "@/lib/admin-locale-store";

export function AdminLocaleToggle() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const locale = useSyncExternalStore(
    subscribeAdminLocale,
    getAdminLocaleSnapshot,
    getAdminLocaleServerSnapshot
  );

  function toggle() {
    const next = locale === "ja" ? "en" : "ja";
    setAdminLocale(next);
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      className="rounded-md border px-2.5 py-1 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100"
    >
      {isPending ? "..." : locale === "ja" ? "EN" : "JA"}
    </button>
  );
}
