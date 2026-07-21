"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerForEvent } from "@/server/actions/registrations";

interface RegistrationFormProps {
  eventId: string;
  labels: {
    email: string;
    attendeeName: string;
    attendeeEmail: string;
    addAttendee: string;
    removeAttendee: string;
    registrationNotes: string;
    register: string;
    registerSuccess: string;
    registerWaitlisted: string;
    registerError: string;
  };
}

export function RegistrationForm({ eventId, labels }: RegistrationFormProps) {
  const [email, setEmail] = useState("");
  const [attendees, setAttendees] = useState([
    { nameJa: "", nameEn: "", email: "" },
  ]);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    status?: string;
    error?: string;
  } | null>(null);

  function addAttendee() {
    setAttendees([...attendees, { nameJa: "", nameEn: "", email: "" }]);
  }

  function removeAttendee(index: number) {
    setAttendees(attendees.filter((_, i) => i !== index));
  }

  function updateAttendee(
    index: number,
    field: "nameJa" | "nameEn" | "email",
    value: string
  ) {
    const updated = [...attendees];
    const attendee = updated[index];
    if (attendee) {
      attendee[field] = value;
      setAttendees(updated);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);

    try {
      const res = await registerForEvent(eventId, {
        email,
        attendees: attendees.filter((a) => a.nameJa),
        notes: notes || undefined,
      });
      setResult(res);
    } catch {
      setResult({ success: false, error: labels.registerError });
    } finally {
      setSubmitting(false);
    }
  }

  if (result?.success) {
    return (
      <div className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">
        {result.status === "WAITLISTED"
          ? labels.registerWaitlisted
          : labels.registerSuccess}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {result?.error && (
        <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {result.error}
        </div>
      )}

      <div>
        <Label>{labels.email} *</Label>
        <Input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {attendees.map((att, i) => (
        <div key={i} className="rounded-md border p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {labels.attendeeName} {i + 1}
            </span>
            {attendees.length > 1 && (
              <button
                type="button"
                onClick={() => removeAttendee(i)}
                className="text-xs text-red-500 hover:underline"
              >
                {labels.removeAttendee}
              </button>
            )}
          </div>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <Input
              placeholder={`${labels.attendeeName} (日本語) *`}
              required
              value={att.nameJa}
              onChange={(e) => updateAttendee(i, "nameJa", e.target.value)}
            />
            <Input
              placeholder={`${labels.attendeeName} (English)`}
              value={att.nameEn}
              onChange={(e) => updateAttendee(i, "nameEn", e.target.value)}
            />
          </div>
          <Input
            className="mt-2"
            type="email"
            placeholder={labels.attendeeEmail}
            value={att.email}
            onChange={(e) => updateAttendee(i, "email", e.target.value)}
          />
        </div>
      ))}

      <button
        type="button"
        onClick={addAttendee}
        className="text-sm text-burgundy-500 hover:underline"
      >
        + {labels.addAttendee}
      </button>

      <div>
        <Label>{labels.registrationNotes}</Label>
        <textarea
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <Button
        type="submit"
        disabled={submitting}
        className="bg-burgundy-500 text-white hover:bg-burgundy-600"
      >
        {submitting ? "..." : labels.register}
      </Button>
    </form>
  );
}
