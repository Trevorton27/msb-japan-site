"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createCenter,
  updateCenter,
  type CenterFormValues,
} from "@/server/actions/centers";

interface CenterFormProps {
  initialData?: CenterFormValues & { id?: string };
}

export function CenterForm({ initialData }: CenterFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isEdit = !!initialData?.id;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const fd = new FormData(e.currentTarget);
    const data: CenterFormValues = {
      slugJa: fd.get("slugJa") as string,
      slugEn: (fd.get("slugEn") as string) || undefined,
      nameJa: fd.get("nameJa") as string,
      nameEn: (fd.get("nameEn") as string) || undefined,
      locationJa: (fd.get("locationJa") as string) || undefined,
      locationEn: (fd.get("locationEn") as string) || undefined,
      country: (fd.get("country") as string) || undefined,
      descriptionJa: (fd.get("descriptionJa") as string) || undefined,
      descriptionEn: (fd.get("descriptionEn") as string) || undefined,
      imageUrl: (fd.get("imageUrl") as string) || undefined,
      websiteUrl: (fd.get("websiteUrl") as string) || undefined,
      active: fd.get("active") === "on",
      sortOrder: Number(fd.get("sortOrder")) || 0,
    };

    try {
      if (isEdit && initialData?.id) {
        await updateCenter(initialData.id, data);
      } else {
        await createCenter(data);
      }
      router.push("/admin/centers");
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
        <legend className="px-2 text-sm font-semibold">Dharma Center Info</legend>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="nameJa">Name (JA) *</Label>
            <Input id="nameJa" name="nameJa" required defaultValue={initialData?.nameJa} />
          </div>
          <div>
            <Label htmlFor="nameEn">Name (EN)</Label>
            <Input id="nameEn" name="nameEn" defaultValue={initialData?.nameEn} />
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
            <Label htmlFor="locationJa">Location (JA)</Label>
            <Input id="locationJa" name="locationJa" defaultValue={initialData?.locationJa} />
          </div>
          <div>
            <Label htmlFor="locationEn">Location (EN)</Label>
            <Input id="locationEn" name="locationEn" defaultValue={initialData?.locationEn} />
          </div>
        </div>

        <div>
          <Label htmlFor="country">Country</Label>
          <Input id="country" name="country" defaultValue={initialData?.country} />
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
            <Label htmlFor="websiteUrl">Website URL</Label>
            <Input id="websiteUrl" name="websiteUrl" type="url" defaultValue={initialData?.websiteUrl} />
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
          {saving ? "Saving..." : isEdit ? "Update Center" : "Create Center"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/centers")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
