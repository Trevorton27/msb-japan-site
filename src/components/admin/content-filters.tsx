"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";

export function ContentFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/admin/content?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        className="rounded-md border px-3 py-2 text-sm"
        value={searchParams.get("type") ?? ""}
        onChange={(e) => updateFilter("type", e.target.value)}
      >
        <option value="">All Types</option>
        <option value="BLOG">Blog</option>
        <option value="TEACHING">Teaching</option>
        <option value="ARTICLE">Article</option>
        <option value="AUDIO">Audio</option>
        <option value="VIDEO">Video</option>
      </select>

      <select
        className="rounded-md border px-3 py-2 text-sm"
        value={searchParams.get("status") ?? ""}
        onChange={(e) => updateFilter("status", e.target.value)}
      >
        <option value="">All Statuses</option>
        <option value="DRAFT">Draft</option>
        <option value="REVIEW">Review</option>
        <option value="APPROVED">Approved</option>
        <option value="SCHEDULED">Scheduled</option>
        <option value="PUBLISHED">Published</option>
        <option value="ARCHIVED">Archived</option>
      </select>

      <Input
        type="search"
        placeholder="Search titles..."
        className="max-w-xs"
        defaultValue={searchParams.get("search") ?? ""}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            updateFilter("search", e.currentTarget.value);
          }
        }}
      />
    </div>
  );
}
