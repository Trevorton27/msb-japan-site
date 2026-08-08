"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createBook,
  updateBook,
  type BookFormValues,
} from "@/server/actions/books";

interface BookFormProps {
  initialData?: BookFormValues & { id?: string };
}

export function BookForm({ initialData }: BookFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isEdit = !!initialData?.id;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const fd = new FormData(e.currentTarget);
    const data: BookFormValues = {
      slugJa: fd.get("slugJa") as string,
      slugEn: (fd.get("slugEn") as string) || undefined,
      titleJa: fd.get("titleJa") as string,
      titleEn: (fd.get("titleEn") as string) || undefined,
      authorJa: (fd.get("authorJa") as string) || undefined,
      authorEn: (fd.get("authorEn") as string) || undefined,
      descriptionJa: (fd.get("descriptionJa") as string) || undefined,
      descriptionEn: (fd.get("descriptionEn") as string) || undefined,
      imageUrl: (fd.get("imageUrl") as string) || undefined,
      purchaseUrl: (fd.get("purchaseUrl") as string) || undefined,
      active: fd.get("active") === "on",
      sortOrder: Number(fd.get("sortOrder")) || 0,
    };

    try {
      if (isEdit && initialData?.id) {
        await updateBook(initialData.id, data);
      } else {
        await createBook(data);
      }
      router.push("/admin/books");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <fieldset className="space-y-4 rounded-lg border p-4">
        <legend className="px-2 text-sm font-semibold">Book Info</legend>

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
            <Label htmlFor="authorJa">Author (JA)</Label>
            <Input id="authorJa" name="authorJa" defaultValue={initialData?.authorJa} />
          </div>
          <div>
            <Label htmlFor="authorEn">Author (EN)</Label>
            <Input id="authorEn" name="authorEn" defaultValue={initialData?.authorEn} />
          </div>
        </div>

        <div>
          <Label htmlFor="descriptionJa">Description (JA)</Label>
          <textarea
            id="descriptionJa"
            name="descriptionJa"
            rows={3}
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            defaultValue={initialData?.descriptionJa}
          />
        </div>
        <div>
          <Label htmlFor="descriptionEn">Description (EN)</Label>
          <textarea
            id="descriptionEn"
            name="descriptionEn"
            rows={3}
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            defaultValue={initialData?.descriptionEn}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input id="imageUrl" name="imageUrl" type="url" defaultValue={initialData?.imageUrl} />
          </div>
          <div>
            <Label htmlFor="purchaseUrl">Purchase URL</Label>
            <Input id="purchaseUrl" name="purchaseUrl" type="url" defaultValue={initialData?.purchaseUrl} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="sortOrder">Sort Order</Label>
            <Input
              id="sortOrder"
              name="sortOrder"
              type="number"
              defaultValue={initialData?.sortOrder ?? 0}
            />
          </div>
          <div className="flex items-end gap-2 pb-1">
            <input
              id="active"
              name="active"
              type="checkbox"
              className="h-4 w-4"
              defaultChecked={initialData?.active ?? true}
            />
            <Label htmlFor="active">Active</Label>
          </div>
        </div>
      </fieldset>

      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : isEdit ? "Update Book" : "Create Book"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/books")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
