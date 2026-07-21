"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function EventFilters({
  locale,
  labels,
}: {
  locale: string;
  labels: {
    allModes: string;
    online: string;
    inPerson: string;
    hybrid: string;
    filterBeginner: string;
  };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/${locale}/events?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <select
        className="rounded-md border px-3 py-2 text-sm"
        value={searchParams.get("mode") ?? ""}
        onChange={(e) => updateFilter("mode", e.target.value)}
      >
        <option value="">{labels.allModes}</option>
        <option value="IN_PERSON">{labels.inPerson}</option>
        <option value="ONLINE">{labels.online}</option>
        <option value="HYBRID">{labels.hybrid}</option>
      </select>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={searchParams.get("beginner") === "true"}
          onChange={(e) =>
            updateFilter("beginner", e.target.checked ? "true" : "")
          }
          className="h-4 w-4"
        />
        {labels.filterBeginner}
      </label>
    </div>
  );
}
