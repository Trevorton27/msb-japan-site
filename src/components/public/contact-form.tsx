"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitContactForm } from "@/server/actions/contacts";

interface ContactFormProps {
  labels: {
    name: string;
    email: string;
    subject: string;
    message: string;
    send: string;
    success: string;
    error: string;
  };
}

export function ContactForm({ labels }: ContactFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    error?: string;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await submitContactForm({
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        subject: (formData.get("subject") as string) || undefined,
        body: formData.get("body") as string,
      });
      setResult(res);
      if (res.success) {
        (e.target as HTMLFormElement).reset();
      }
    } catch {
      setResult({ success: false, error: labels.error });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {result?.success && (
        <div className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">
          {labels.success}
        </div>
      )}
      {result && !result.success && (
        <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {result.error ?? labels.error}
        </div>
      )}

      <div>
        <Label htmlFor="name">{labels.name} *</Label>
        <Input id="name" name="name" required maxLength={100} />
      </div>

      <div>
        <Label htmlFor="email">{labels.email} *</Label>
        <Input id="email" name="email" type="email" required />
      </div>

      <div>
        <Label htmlFor="subject">{labels.subject}</Label>
        <Input id="subject" name="subject" maxLength={200} />
      </div>

      <div>
        <Label htmlFor="body">{labels.message} *</Label>
        <textarea
          id="body"
          name="body"
          required
          maxLength={5000}
          rows={5}
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
        />
      </div>

      <Button
        type="submit"
        disabled={submitting}
        className="bg-burgundy-500 text-white hover:bg-burgundy-600"
      >
        {submitting ? "..." : labels.send}
      </Button>
    </form>
  );
}
