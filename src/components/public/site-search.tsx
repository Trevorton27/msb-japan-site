"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { Locale } from "@/lib/i18n/config";

export interface SearchLabels {
  label: string;
  placeholder: string;
  submit: string;
}

export function SiteSearch({
  locale,
  labels,
  triggerClassName,
}: {
  locale: Locale;
  labels: SearchLabels;
  triggerClassName?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setOpen(false);
    router.push(`/${locale}/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className={
          triggerClassName ??
          "inline-flex items-center justify-center rounded-md p-2 text-charcoal-600 transition-colors hover:bg-ivory-100 hover:text-charcoal-900"
        }
        aria-label={labels.label}
      >
        <SearchIcon className="h-5 w-5" aria-hidden="true" />
      </SheetTrigger>
      <SheetContent side="top" className="bg-[#ede9dc] px-4 py-8 sm:px-6">
        <SheetTitle className="sr-only">{labels.label}</SheetTitle>
        <form
          role="search"
          onSubmit={handleSubmit}
          className="mx-auto flex w-full max-w-2xl items-center gap-2"
        >
          <SearchIcon
            className="h-5 w-5 shrink-0 text-charcoal-500"
            aria-hidden="true"
          />
          <input
            type="search"
            name="q"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={labels.placeholder}
            aria-label={labels.label}
            className="min-w-0 flex-1 border-b border-charcoal-500 bg-transparent px-1 py-2 text-lg text-charcoal-900 outline-none placeholder:text-charcoal-500 focus:border-burgundy-500"
          />
          <button
            type="submit"
            className="rounded-md bg-burgundy-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-burgundy-600"
          >
            {labels.submit}
          </button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
