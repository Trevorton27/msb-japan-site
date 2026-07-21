"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createEvent,
  updateEvent,
  type EventFormValues,
} from "@/server/actions/events";

interface EventFormProps {
  initialData?: EventFormValues & { id?: string };
}

export function EventForm({ initialData }: EventFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isEdit = !!initialData?.id;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data: EventFormValues = {
      slugJa: formData.get("slugJa") as string,
      slugEn: (formData.get("slugEn") as string) || undefined,
      titleJa: formData.get("titleJa") as string,
      titleEn: (formData.get("titleEn") as string) || undefined,
      descriptionJa: (formData.get("descriptionJa") as string) || undefined,
      descriptionEn: (formData.get("descriptionEn") as string) || undefined,
      status: formData.get("status") as EventFormValues["status"],
      mode: formData.get("mode") as EventFormValues["mode"],
      priceType: formData.get("priceType") as EventFormValues["priceType"],
      priceAmount: formData.get("priceAmount")
        ? Number(formData.get("priceAmount"))
        : undefined,
      capacity: formData.get("capacity")
        ? Number(formData.get("capacity"))
        : undefined,
      beginnerFriendly: formData.get("beginnerFriendly") === "on",
      startsAt: formData.get("startsAt") as string,
      endsAt: formData.get("endsAt") as string,
      registrationOpensAt:
        (formData.get("registrationOpensAt") as string) || undefined,
      registrationClosesAt:
        (formData.get("registrationClosesAt") as string) || undefined,
      venueId: (formData.get("venueId") as string) || undefined,
      onlineUrl: (formData.get("onlineUrl") as string) || undefined,
      imageUrl: (formData.get("imageUrl") as string) || undefined,
    };

    try {
      if (isEdit && initialData?.id) {
        await updateEvent(initialData.id, data);
      } else {
        await createEvent(data);
      }
      router.push("/admin/events");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save event");
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
        <legend className="px-2 text-sm font-semibold">Basic Info</legend>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="titleJa">Title (JA) *</Label>
            <Input
              id="titleJa"
              name="titleJa"
              required
              defaultValue={initialData?.titleJa}
            />
          </div>
          <div>
            <Label htmlFor="titleEn">Title (EN)</Label>
            <Input
              id="titleEn"
              name="titleEn"
              defaultValue={initialData?.titleEn}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="slugJa">Slug (JA) *</Label>
            <Input
              id="slugJa"
              name="slugJa"
              required
              defaultValue={initialData?.slugJa}
            />
          </div>
          <div>
            <Label htmlFor="slugEn">Slug (EN)</Label>
            <Input
              id="slugEn"
              name="slugEn"
              defaultValue={initialData?.slugEn}
            />
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
      </fieldset>

      <fieldset className="space-y-4 rounded-lg border p-4">
        <legend className="px-2 text-sm font-semibold">
          Schedule & Location
        </legend>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="startsAt">Start *</Label>
            <Input
              id="startsAt"
              name="startsAt"
              type="datetime-local"
              required
              defaultValue={initialData?.startsAt}
            />
          </div>
          <div>
            <Label htmlFor="endsAt">End *</Label>
            <Input
              id="endsAt"
              name="endsAt"
              type="datetime-local"
              required
              defaultValue={initialData?.endsAt}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="registrationOpensAt">Registration Opens</Label>
            <Input
              id="registrationOpensAt"
              name="registrationOpensAt"
              type="datetime-local"
              defaultValue={initialData?.registrationOpensAt}
            />
          </div>
          <div>
            <Label htmlFor="registrationClosesAt">Registration Closes</Label>
            <Input
              id="registrationClosesAt"
              name="registrationClosesAt"
              type="datetime-local"
              defaultValue={initialData?.registrationClosesAt}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="mode">Mode *</Label>
            <select
              id="mode"
              name="mode"
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
              defaultValue={initialData?.mode ?? "IN_PERSON"}
            >
              <option value="IN_PERSON">In Person</option>
              <option value="ONLINE">Online</option>
              <option value="HYBRID">Hybrid</option>
            </select>
          </div>
          <div>
            <Label htmlFor="onlineUrl">Online URL</Label>
            <Input
              id="onlineUrl"
              name="onlineUrl"
              type="url"
              defaultValue={initialData?.onlineUrl}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-4 rounded-lg border p-4">
        <legend className="px-2 text-sm font-semibold">Pricing & Status</legend>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="status">Status *</Label>
            <select
              id="status"
              name="status"
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
              defaultValue={initialData?.status ?? "DRAFT"}
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
          <div>
            <Label htmlFor="priceType">Price Type *</Label>
            <select
              id="priceType"
              name="priceType"
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
              defaultValue={initialData?.priceType ?? "FREE"}
            >
              <option value="FREE">Free</option>
              <option value="FIXED">Fixed</option>
              <option value="DONATION">Donation</option>
              <option value="SLIDING_SCALE">Sliding Scale</option>
            </select>
          </div>
          <div>
            <Label htmlFor="priceAmount">Price (JPY)</Label>
            <Input
              id="priceAmount"
              name="priceAmount"
              type="number"
              min={0}
              defaultValue={initialData?.priceAmount}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="capacity">Capacity</Label>
            <Input
              id="capacity"
              name="capacity"
              type="number"
              min={1}
              defaultValue={initialData?.capacity}
            />
          </div>
          <div className="flex items-end gap-2 pb-1">
            <input
              id="beginnerFriendly"
              name="beginnerFriendly"
              type="checkbox"
              className="h-4 w-4"
              defaultChecked={initialData?.beginnerFriendly}
            />
            <Label htmlFor="beginnerFriendly">Beginner Friendly</Label>
          </div>
        </div>
      </fieldset>

      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : isEdit ? "Update Event" : "Create Event"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/events")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
