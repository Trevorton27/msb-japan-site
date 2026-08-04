"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function EventsViewToggle({
  locale,
  labels,
}: {
  locale: string;
  labels: { list: string; calendar: string };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams.get("view") ?? "list";

  function setView(v: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", v);
    router.push(`/${locale}/events?${params.toString()}`);
  }

  return (
    <div className="inline-flex rounded-md border border-charcoal-300">
      <button
        type="button"
        onClick={() => setView("list")}
        className={`px-3 py-1.5 text-sm font-medium transition-colors ${
          view === "list"
            ? "bg-charcoal-900 text-white"
            : "text-charcoal-600 hover:bg-ivory-100"
        } rounded-l-md`}
      >
        {labels.list}
      </button>
      <button
        type="button"
        onClick={() => setView("calendar")}
        className={`px-3 py-1.5 text-sm font-medium transition-colors ${
          view === "calendar"
            ? "bg-charcoal-900 text-white"
            : "text-charcoal-600 hover:bg-ivory-100"
        } rounded-r-md`}
      >
        {labels.calendar}
      </button>
    </div>
  );
}
