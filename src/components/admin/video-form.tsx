"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createVideo, updateVideo, deleteVideo } from "@/server/actions/videos";
import type { VideoFormValues } from "@/server/actions/videos";

type InitialData = VideoFormValues & { id: string };

function extractYoutubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([a-zA-Z0-9_-]{11})/
  );
  return match?.[1] ?? null;
}

export function VideoForm({ initialData }: { initialData?: InitialData }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState(
    initialData?.thumbnailUrl ?? ""
  );

  function handleYoutubeUrlChange(e: React.ChangeEvent<HTMLInputElement>) {
    const id = extractYoutubeId(e.target.value);
    if (id) {
      const thumb = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
      setThumbnailPreview(thumb);
      // Auto-fill the hidden thumbnail input
      const form = e.target.form;
      if (form) {
        const thumbInput = form.elements.namedItem("thumbnailUrl") as HTMLInputElement;
        if (thumbInput && !thumbInput.value) {
          thumbInput.value = thumb;
        }
      }
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const data: VideoFormValues = {
      titleJa: form.get("titleJa") as string,
      titleEn: (form.get("titleEn") as string) || undefined,
      descriptionJa: (form.get("descriptionJa") as string) || undefined,
      descriptionEn: (form.get("descriptionEn") as string) || undefined,
      youtubeUrl: form.get("youtubeUrl") as string,
      thumbnailUrl: (form.get("thumbnailUrl") as string) || undefined,
      category: (form.get("category") as VideoFormValues["category"]) || "TEACHING",
      sortOrder: Number(form.get("sortOrder")) || 0,
      published: form.get("published") === "on",
    };

    const result = initialData
      ? await updateVideo(initialData.id, data)
      : await createVideo(data);

    setSaving(false);
    if (result.success) {
      router.push("/admin/videos");
    } else {
      setError("Failed to save. Please try again.");
    }
  }

  async function handleDelete() {
    if (!initialData?.id || !confirm("Delete this video?")) return;
    const result = await deleteVideo(initialData.id);
    if (result.success) {
      router.push("/admin/videos");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      <fieldset className="rounded-lg border bg-white p-6">
        <legend className="px-1 text-sm font-semibold text-charcoal-700">
          Video Details
        </legend>

        {/* YouTube URL */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            YouTube URL <span className="text-red-500">*</span>
          </label>
          <input
            name="youtubeUrl"
            defaultValue={initialData?.youtubeUrl}
            required
            placeholder="https://www.youtube.com/watch?v=..."
            onChange={handleYoutubeUrlChange}
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        {/* Thumbnail preview */}
        {thumbnailPreview && (
          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-1">Thumbnail Preview</p>
            <img
              src={thumbnailPreview}
              alt="Video thumbnail"
              className="h-32 rounded-md border object-cover"
            />
          </div>
        )}

        <input
          type="hidden"
          name="thumbnailUrl"
          defaultValue={initialData?.thumbnailUrl ?? ""}
        />

        {/* Titles */}
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
        </div>

        {/* Descriptions */}
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description (JA)
            </label>
            <textarea
              name="descriptionJa"
              defaultValue={initialData?.descriptionJa}
              rows={3}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description (EN)
            </label>
            <textarea
              name="descriptionEn"
              defaultValue={initialData?.descriptionEn}
              rows={3}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
        </div>

        {/* Category, Sort Order, Published */}
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              name="category"
              defaultValue={initialData?.category ?? "TEACHING"}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            >
              <option value="TEACHING">Teaching</option>
              <option value="MEDITATION">Meditation</option>
              <option value="DHARMA_TALK">Dharma Talk</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Sort Order</label>
            <input
              name="sortOrder"
              type="number"
              defaultValue={initialData?.sortOrder ?? 0}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <div className="flex items-end gap-2 pb-1">
            <input
              name="published"
              id="video-published"
              type="checkbox"
              defaultChecked={initialData?.published ?? false}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor="video-published" className="text-sm font-medium text-gray-700">
              Published
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
          {saving ? "Saving..." : "Save Video"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/videos")}
          className="rounded-md border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        {initialData?.id && (
          <button
            type="button"
            onClick={handleDelete}
            className="ml-auto rounded-md border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
}
