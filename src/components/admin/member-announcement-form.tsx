"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createMemberAnnouncement,
  updateMemberAnnouncement,
} from "@/server/actions/member-announcements";
import type { MemberAnnouncementFormValues } from "@/server/actions/member-announcements";

type InitialData = MemberAnnouncementFormValues & { id: string };

export function MemberAnnouncementForm({ initialData }: { initialData?: InitialData }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const data: MemberAnnouncementFormValues = {
      titleJa: form.get("titleJa") as string,
      titleEn: (form.get("titleEn") as string) || undefined,
      contentJa: form.get("contentJa") as string,
      contentEn: (form.get("contentEn") as string) || undefined,
      published: form.get("published") === "on",
      pinned: form.get("pinned") === "on",
    };

    const result = initialData
      ? await updateMemberAnnouncement(initialData.id, data)
      : await createMemberAnnouncement(data);

    setSaving(false);
    if (result.success) {
      router.push("/admin/member-announcements");
    } else {
      setError("Failed to save. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      <fieldset className="rounded-lg border bg-white p-6">
        <legend className="px-1 text-sm font-semibold text-charcoal-700">Announcement</legend>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title (JA) <span className="text-red-500">*</span>
            </label>
            <input
              name="titleJa"
              defaultValue={initialData?.titleJa}
              required
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Title (EN)</label>
            <input
              name="titleEn"
              defaultValue={initialData?.titleEn}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Content (JA) <span className="text-red-500">*</span>
            </label>
            <textarea
              name="contentJa"
              defaultValue={initialData?.contentJa}
              required
              rows={6}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Content (EN)</label>
            <textarea
              name="contentEn"
              defaultValue={initialData?.contentEn}
              rows={6}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
        </div>
        <div className="mt-4 flex gap-6">
          <div className="flex items-center gap-2">
            <input
              name="published"
              id="a-published"
              type="checkbox"
              defaultChecked={initialData?.published ?? false}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor="a-published" className="text-sm font-medium text-gray-700">
              Published
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              name="pinned"
              id="a-pinned"
              type="checkbox"
              defaultChecked={initialData?.pinned ?? false}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor="a-pinned" className="text-sm font-medium text-gray-700">
              Pinned
            </label>
          </div>
        </div>
      </fieldset>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Announcement"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/member-announcements")}
          className="rounded-md border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
