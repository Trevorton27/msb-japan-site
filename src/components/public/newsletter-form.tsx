"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterForm({
  placeholder,
  buttonText,
  successText,
}: {
  placeholder: string;
  buttonText: string;
  successText: string;
}) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    // TODO: Server action for newsletter signup
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <p className="text-sm font-medium text-burgundy-500">{successText}</p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={placeholder}
        className="max-w-xs"
      />
      <Button
        type="submit"
        className="bg-burgundy-500 text-white hover:bg-burgundy-600"
      >
        {buttonText}
      </Button>
    </form>
  );
}
