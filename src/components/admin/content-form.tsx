"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createContentPost,
  updateContentPost,
  type ContentPostFormValues,
} from "@/server/actions/content";

interface ContentFormProps {
  initialData?: ContentPostFormValues & { id?: string };
  teachers?: { id: string; nameJa: string; nameEn: string | null }[];
}

export function ContentForm({ initialData, teachers = [] }: ContentFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const isEdit = !!initialData?.id;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const fd = new FormData(e.currentTarget);
    const data: ContentPostFormValues = {
      slugJa: fd.get("slugJa") as string,
      slugEn: (fd.get("slugEn") as string) || undefined,
      titleJa: fd.get("titleJa") as string,
      titleEn: (fd.get("titleEn") as string) || undefined,
      bodyJa: (fd.get("bodyJa") as string) || undefined,
      bodyEn: (fd.get("bodyEn") as string) || undefined,
      excerptJa: (fd.get("excerptJa") as string) || undefined,
      excerptEn: (fd.get("excerptEn") as string) || undefined,
      type: fd.get("type") as ContentPostFormValues["type"],
      status: fd.get("status") as ContentPostFormValues["status"],
      teacherId: (fd.get("teacherId") as string) || undefined,
      imageUrl: (fd.get("imageUrl") as string) || undefined,
      mediaUrl: (fd.get("mediaUrl") as string) || undefined,
      scheduledAt: (fd.get("scheduledAt") as string) || undefined,
    };

    try {
      if (isEdit && initialData?.id) {
        await updateContentPost(initialData.id, data);
      } else {
        await createContentPost(data);
      }
      router.push("/admin/content");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <fieldset className="space-y-4 rounded-lg border p-4">
        <legend className="px-2 text-sm font-semibold">Basic Info</legend>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="titleJa">Title (JA) *</Label>
            <Input id="titleJa" name="titleJa" required defaultValue={initialData?.titleJa} />
          </div>
          <div>
            <Label htmlFor="titleEn">Title (EN)</Label>
            <Input id="titleEn" name="titleEn" defaultValue={initialData?.titleEn} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="slugJa">Slug (JA) *</Label>
            <Input id="slugJa" name="slugJa" required defaultValue={initialData?.slugJa} />
          </div>
          <div>
            <Label htmlFor="slugEn">Slug (EN)</Label>
            <Input id="slugEn" name="slugEn" defaultValue={initialData?.slugEn} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="excerptJa">Excerpt (JA)</Label>
            <textarea id="excerptJa" name="excerptJa" rows={2} className="mt-1 w-full rounded-md border px-3 py-2 text-sm" defaultValue={initialData?.excerptJa} />
          </div>
          <div>
            <Label htmlFor="excerptEn">Excerpt (EN)</Label>
            <textarea id="excerptEn" name="excerptEn" rows={2} className="mt-1 w-full rounded-md border px-3 py-2 text-sm" defaultValue={initialData?.excerptEn} />
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-4 rounded-lg border p-4">
        <legend className="px-2 text-sm font-semibold">Content</legend>

        <div>
          <Label htmlFor="bodyJa">Body (JA)</Label>
          <textarea id="bodyJa" name="bodyJa" rows={10} className="mt-1 w-full rounded-md border px-3 py-2 text-sm font-mono" defaultValue={initialData?.bodyJa} />
        </div>
        <div>
          <Label htmlFor="bodyEn">Body (EN)</Label>
          <textarea id="bodyEn" name="bodyEn" rows={10} className="mt-1 w-full rounded-md border px-3 py-2 text-sm font-mono" defaultValue={initialData?.bodyEn} />
        </div>
      </fieldset>

      <fieldset className="space-y-4 rounded-lg border p-4">
        <legend className="px-2 text-sm font-semibold">Metadata</legend>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="type">Type *</Label>
            <select id="type" name="type" className="mt-1 w-full rounded-md border px-3 py-2 text-sm" defaultValue={initialData?.type ?? "BLOG"}>
              <option value="BLOG">Blog</option>
              <option value="TEACHING">Teaching</option>
              <option value="ARTICLE">Article</option>
              <option value="AUDIO">Audio</option>
              <option value="VIDEO">Video</option>
            </select>
          </div>
          <div>
            <Label htmlFor="status">Status *</Label>
            <select id="status" name="status" className="mt-1 w-full rounded-md border px-3 py-2 text-sm" defaultValue={initialData?.status ?? "DRAFT"}>
              <option value="DRAFT">Draft</option>
              <option value="REVIEW">Review</option>
              <option value="APPROVED">Approved</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
          <div>
            <Label htmlFor="teacherId">Teacher</Label>
            <select id="teacherId" name="teacherId" className="mt-1 w-full rounded-md border px-3 py-2 text-sm" defaultValue={initialData?.teacherId ?? ""}>
              <option value="">None</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>{t.nameJa}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input id="imageUrl" name="imageUrl" type="url" defaultValue={initialData?.imageUrl} />
          </div>
          <div>
            <Label htmlFor="mediaUrl">Media URL (audio/video)</Label>
            <Input id="mediaUrl" name="mediaUrl" type="url" defaultValue={initialData?.mediaUrl} />
          </div>
        </div>

        <div>
          <Label htmlFor="scheduledAt">Scheduled Publish Date</Label>
          <Input id="scheduledAt" name="scheduledAt" type="datetime-local" defaultValue={initialData?.scheduledAt} />
        </div>
      </fieldset>

      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : isEdit ? "Update Post" : "Create Post"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/content")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
