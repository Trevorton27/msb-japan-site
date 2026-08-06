"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitContactForm } from "@/server/actions/contacts";

interface ContactFormProps {
  locale: string;
  labels: {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    send: string;
    sending: string;
    success: string;
    error: string;
  };
}

export function ContactForm({ locale, labels }: ContactFormProps) {
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
        phone: (formData.get("phone") as string) || undefined,
        subject: (formData.get("subject") as string) || undefined,
        body: formData.get("body") as string,
      }, locale);
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
    <form onSubmit={handleSubmit} className="space-y-5">
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

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">{labels.name} *</Label>
          <Input id="name" name="name" required maxLength={100} className="mt-1" />
        </div>

        <div>
          <Label htmlFor="email">{labels.email} *</Label>
          <Input id="email" name="email" type="email" required className="mt-1" />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="phone">{labels.phone}</Label>
          <Input id="phone" name="phone" type="tel" maxLength={30} className="mt-1" />
        </div>

        <div>
          <Label htmlFor="subject">{labels.subject}</Label>
          <Input id="subject" name="subject" maxLength={200} className="mt-1" />
        </div>
      </div>

      <div>
        <Label htmlFor="body">{labels.message} *</Label>
        <textarea
          id="body"
          name="body"
          required
          maxLength={5000}
          rows={6}
          className="mt-1 w-full rounded-md border border-charcoal-300 px-3 py-2 text-sm focus:border-burgundy-500 focus:ring-1 focus:ring-burgundy-500 focus:outline-none"
        />
      </div>

      <Button
        type="submit"
        disabled={submitting}
        className="bg-burgundy-500 text-white hover:bg-burgundy-600"
      >
        {submitting ? labels.sending : labels.send}
      </Button>
    </form>
  );
}
