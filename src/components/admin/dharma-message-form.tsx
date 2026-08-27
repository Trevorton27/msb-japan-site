"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createDharmaMessage,
  updateDharmaMessage,
  deleteDharmaMessage,
} from "@/server/actions/dharma-messages";
import type { DharmaMessageFormValues } from "@/server/actions/dharma-messages";

type InitialData = DharmaMessageFormValues & { id: string };

export function DharmaMessageForm({ initialData }: { initialData?: InitialData }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const data: DharmaMessageFormValues = {
      quoteJa: form.get("quoteJa") as string,
      quoteEn: (form.get("quoteEn") as string) || undefined,
      attributionJa: form.get("attributionJa") as string,
      attributionEn: (form.get("attributionEn") as string) || undefined,
      sourceJa: (form.get("sourceJa") as string) || undefined,
      sourceEn: (form.get("sourceEn") as string) || undefined,
      sortOrder: Number(form.get("sortOrder")) || 0,
      published: form.get("published") === "on",
    };

    const result = initialData
      ? await updateDharmaMessage(initialData.id, data)
      : await createDharmaMessage(data);

    setSaving(false);
    if (result.success) {
      router.push("/admin/dharma-messages");
    } else {
      setError("Failed to save. Please try again.");
    }
  }

  async function handleDelete() {
    if (!initialData?.id || !confirm("Delete this dharma message?")) return;
    const result = await deleteDharmaMessage(initialData.id);
    if (result.success) {
      router.push("/admin/dharma-messages");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      <fieldset className="rounded-lg border bg-white p-6">
        <legend className="px-1 text-sm font-semibold text-charcoal-700">
          Dharma Message
        </legend>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Quote (JA) <span className="text-red-500">*</span>
            </label>
            <textarea
              name="quoteJa"
              defaultValue={initialData?.quoteJa}
              required
              rows={4}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Quote (EN)</label>
            <textarea
              name="quoteEn"
              defaultValue={initialData?.quoteEn}
              rows={4}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Attribution (JA) <span className="text-red-500">*</span>
            </label>
            <input
              name="attributionJa"
              defaultValue={initialData?.attributionJa}
              required
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Attribution (EN)
            </label>
            <input
              name="attributionEn"
              defaultValue={initialData?.attributionEn}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Source (JA)</label>
            <input
              name="sourceJa"
              defaultValue={initialData?.sourceJa}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Source (EN)</label>
            <input
              name="sourceEn"
              defaultValue={initialData?.sourceEn}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
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
              id="dm-published"
              type="checkbox"
              defaultChecked={initialData?.published ?? false}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor="dm-published" className="text-sm font-medium text-gray-700">
              Published (available for rotation)
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
          {saving ? "Saving..." : "Save Message"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/dharma-messages")}
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
