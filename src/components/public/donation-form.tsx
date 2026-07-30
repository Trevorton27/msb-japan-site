"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createDonation } from "@/server/actions/donations";

const PRESET_AMOUNTS = [1000, 3000, 5000, 10000, 30000, 50000];

type Designation = "GENERAL" | "LIFE_RELEASE" | "DRUPCHO";

interface DonationFormProps {
  locale: string;
  dict: {
    amount: string;
    customAmount: string;
    oneTime: string;
    monthly: string;
    name: string;
    nameOptional: string;
    email: string;
    message: string;
    messageOptional: string;
    donate: string;
    processing: string;
    error: string;
    designation: string;
    designationGeneral: string;
    designationLifeRelease: string;
    designationDrupcho: string;
    prayerRequest: string;
    prayerRequestHint: string;
  };
}

export function DonationForm({ locale, dict }: DonationFormProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(5000);
  const [customAmount, setCustomAmount] = useState("");
  const [recurring, setRecurring] = useState(false);
  const [designation, setDesignation] = useState<Designation>("GENERAL");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const amount =
    selectedAmount ?? (customAmount ? parseInt(customAmount, 10) : 0);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (amount < 100) return;

    setLoading(true);
    setError("");

    const fd = new FormData(e.currentTarget);
    try {
      const result = await createDonation({
        email: fd.get("email") as string,
        amount,
        recurring,
        designation,
        donorName: (fd.get("donorName") as string) || undefined,
        message: (fd.get("message") as string) || undefined,
        locale,
      });

      if (result.success && result.url) {
        window.location.href = result.url;
      } else {
        setError(dict.error);
        setLoading(false);
      }
    } catch {
      setError(dict.error);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-6">
      {/* Frequency toggle */}
      <div className="flex rounded-lg border bg-white p-1">
        <button
          type="button"
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            !recurring
              ? "bg-burgundy-600 text-white"
              : "text-charcoal-600 hover:bg-gray-50"
          }`}
          onClick={() => setRecurring(false)}
        >
          {dict.oneTime}
        </button>
        <button
          type="button"
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            recurring
              ? "bg-burgundy-600 text-white"
              : "text-charcoal-600 hover:bg-gray-50"
          }`}
          onClick={() => setRecurring(true)}
        >
          {dict.monthly}
        </button>
      </div>

      {/* Preset amounts */}
      <div>
        <Label>{dict.amount}</Label>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {PRESET_AMOUNTS.map((preset) => (
            <button
              key={preset}
              type="button"
              className={`rounded-lg border px-3 py-3 text-sm font-medium transition-colors ${
                selectedAmount === preset
                  ? "border-burgundy-600 bg-burgundy-50 text-burgundy-700"
                  : "text-charcoal-700 border-gray-200 bg-white hover:border-gray-300"
              }`}
              onClick={() => {
                setSelectedAmount(preset);
                setCustomAmount("");
              }}
            >
              ¥{preset.toLocaleString()}
            </button>
          ))}
        </div>
      </div>

      {/* Designation */}
      <div>
        <Label htmlFor="designation">{dict.designation}</Label>
        <select
          id="designation"
          value={designation}
          onChange={(e) => setDesignation(e.target.value as Designation)}
          className="mt-1 w-full rounded-md border bg-white px-3 py-2 text-sm"
        >
          <option value="GENERAL">{dict.designationGeneral}</option>
          <option value="LIFE_RELEASE">{dict.designationLifeRelease}</option>
          <option value="DRUPCHO">{dict.designationDrupcho}</option>
        </select>
      </div>

      {/* Custom amount */}
      <div>
        <Label htmlFor="customAmount">{dict.customAmount}</Label>
        <div className="relative mt-1">
          <span className="text-charcoal-500 absolute top-1/2 left-3 -translate-y-1/2 text-sm">
            ¥
          </span>
          <Input
            id="customAmount"
            type="number"
            min={100}
            step={1}
            className="pl-7"
            value={customAmount}
            onChange={(e) => {
              setCustomAmount(e.target.value);
              setSelectedAmount(null);
            }}
            placeholder="100"
          />
        </div>
      </div>

      {/* Donor info */}
      <div className="space-y-3">
        <div>
          <Label htmlFor="email">{dict.email}</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="donorName">
            {dict.name}{" "}
            <span className="text-charcoal-400 text-xs">
              ({dict.nameOptional})
            </span>
          </Label>
          <Input id="donorName" name="donorName" className="mt-1" />
        </div>
        <div>
          <Label htmlFor="message">
            {designation === "GENERAL" ? dict.message : dict.prayerRequest}{" "}
            <span className="text-charcoal-400 text-xs">
              ({dict.messageOptional})
            </span>
          </Label>
          {designation !== "GENERAL" && (
            <p className="text-charcoal-500 mt-1 text-xs">
              {dict.prayerRequestHint}
            </p>
          )}
          <textarea
            id="message"
            name="message"
            rows={3}
            maxLength={500}
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button
        type="submit"
        disabled={loading || amount < 100}
        className="bg-burgundy-600 hover:bg-burgundy-700 w-full"
        size="lg"
      >
        {loading
          ? dict.processing
          : `${dict.donate} ¥${amount.toLocaleString()}${recurring ? ` / ${locale === "ja" ? "月" : "mo"}` : ""}`}
      </Button>
    </form>
  );
}
