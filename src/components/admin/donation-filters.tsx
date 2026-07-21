"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function DonationFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get("status") ?? "";
  const type = searchParams.get("type") ?? "";

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/admin/donations?${params.toString()}`);
  }

  return (
    <div className="flex gap-3">
      <select
        value={status}
        onChange={(e) => updateFilter("status", e.target.value)}
        className="rounded-md border px-3 py-2 text-sm"
      >
        <option value="">All Statuses</option>
        <option value="PENDING">Pending</option>
        <option value="COMPLETED">Completed</option>
        <option value="FAILED">Failed</option>
        <option value="REFUNDED">Refunded</option>
      </select>
      <select
        value={type}
        onChange={(e) => updateFilter("type", e.target.value)}
        className="rounded-md border px-3 py-2 text-sm"
      >
        <option value="">All Types</option>
        <option value="one-time">One-time</option>
        <option value="recurring">Recurring</option>
      </select>
    </div>
  );
}
