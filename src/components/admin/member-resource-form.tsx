"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createMemberResource,
  updateMemberResource,
} from "@/server/actions/member-resources";
import type { MemberResourceFormValues } from "@/server/actions/member-resources";
import type { ResourceType } from "@prisma/client";

type InitialData = MemberResourceFormValues & { id: string };

const RESOURCE_TYPES: ResourceType[] = [
  "ARTICLE", "PDF", "AUDIO", "VIDEO", "LINK",
  "PRACTICE_TEXT", "COURSE_MATERIAL", "RETREAT_MATERIAL",
];

const RESOURCE_TYPE_LABELS: Record<ResourceType, string> = {
  ARTICLE: "Article", PDF: "PDF", AUDIO: "Audio", VIDEO: "Video", LINK: "Link",
  PRACTICE_TEXT: "Practice Text", COURSE_MATERIAL: "Course Material",
  RETREAT_MATERIAL: "Retreat Material",
};

export function MemberResourceForm({ initialData }: { initialData?: InitialData }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const data: MemberResourceFormValues = {
      slugJa: form.get("slugJa") as string,
      slugEn: (form.get("slugEn") as string) || undefined,
      titleJa: form.get("titleJa") as string,
      titleEn: (form.get("titleEn") as string) || undefined,
      descriptionJa: (form.get("descriptionJa") as string) || undefined,
      descriptionEn: (form.get("descriptionEn") as string) || undefined,
      contentJa: (form.get("contentJa") as string) || undefined,
      contentEn: (form.get("contentEn") as string) || undefined,
      resourceType: (form.get("resourceType") as ResourceType) || "ARTICLE",
      fileUrl: (form.get("fileUrl") as string) || undefined,
      externalUrl: (form.get("externalUrl") as string) || undefined,
      videoUrl: (form.get("videoUrl") as string) || undefined,
      audioUrl: (form.get("audioUrl") as string) || undefined,
      published: form.get("published") === "on",
      featured: form.get("featured") === "on",
      sortOrder: Number(form.get("sortOrder") || 0),
    };

    const result = initialData
      ? await updateMemberResource(initialData.id, data)
      : await createMemberResource(data);

    setSaving(false);
    if (result.success) {
      router.push("/admin/member-resources");
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
        <legend className="px-1 text-sm font-semibold text-charcoal-700">
          Resource Info
        </legend>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Slug (JA) <span className="text-red-500">*</span>
            </label>
            <input
              name="slugJa"
              defaultValue={initialData?.slugJa}
              required
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
              placeholder="e.g. ngondro-guide"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Slug (EN)</label>
            <input
              name="slugEn"
              defaultValue={initialData?.slugEn}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
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
            <label className="block text-sm font-medium text-gray-700">Description (JA)</label>
            <textarea
              name="descriptionJa"
              defaultValue={initialData?.descriptionJa}
              rows={2}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description (EN)</label>
            <textarea
              name="descriptionEn"
              defaultValue={initialData?.descriptionEn}
              rows={2}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Resource Type</label>
          <select
            name="resourceType"
            defaultValue={initialData?.resourceType ?? "ARTICLE"}
            className="mt-1 rounded-md border px-3 py-2 text-sm"
          >
            {RESOURCE_TYPES.map((rt) => (
              <option key={rt} value={rt}>
                {RESOURCE_TYPE_LABELS[rt]}
              </option>
            ))}
          </select>
        </div>
      </fieldset>

      <fieldset className="rounded-lg border bg-white p-6">
        <legend className="px-1 text-sm font-semibold text-charcoal-700">Links & Files</legend>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">File URL</label>
            <input
              name="fileUrl"
              defaultValue={initialData?.fileUrl}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">External URL</label>
            <input
              name="externalUrl"
              defaultValue={initialData?.externalUrl}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Audio URL</label>
            <input
              name="audioUrl"
              defaultValue={initialData?.audioUrl}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Video URL</label>
            <input
              name="videoUrl"
              defaultValue={initialData?.videoUrl}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
              placeholder="https://..."
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="rounded-lg border bg-white p-6">
        <legend className="px-1 text-sm font-semibold text-charcoal-700">Content (JA)</legend>
        <textarea
          name="contentJa"
          defaultValue={initialData?.contentJa}
          rows={8}
          className="mt-4 w-full rounded-md border px-3 py-2 text-sm font-mono"
          placeholder="HTML or plain text content (Japanese)"
        />
      </fieldset>

      <fieldset className="rounded-lg border bg-white p-6">
        <legend className="px-1 text-sm font-semibold text-charcoal-700">Content (EN)</legend>
        <textarea
          name="contentEn"
          defaultValue={initialData?.contentEn}
          rows={8}
          className="mt-4 w-full rounded-md border px-3 py-2 text-sm font-mono"
          placeholder="HTML or plain text content (English)"
        />
      </fieldset>

      <fieldset className="rounded-lg border bg-white p-6">
        <legend className="px-1 text-sm font-semibold text-charcoal-700">Settings</legend>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Sort Order</label>
            <input
              name="sortOrder"
              type="number"
              defaultValue={initialData?.sortOrder ?? 0}
              className="mt-1 w-24 rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <div className="flex items-center gap-2 pt-6">
            <input
              name="published"
              id="published"
              type="checkbox"
              defaultChecked={initialData?.published ?? false}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor="published" className="text-sm font-medium text-gray-700">
              Published
            </label>
          </div>
          <div className="flex items-center gap-2 pt-6">
            <input
              name="featured"
              id="featured"
              type="checkbox"
              defaultChecked={initialData?.featured ?? false}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor="featured" className="text-sm font-medium text-gray-700">
              Featured
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
          {saving ? "Saving..." : "Save Resource"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/member-resources")}
          className="rounded-md border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
