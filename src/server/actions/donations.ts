"use server";

import { db } from "@/lib/db";
import { donationSchema } from "@/lib/validation/schemas";
import type { DonationValues } from "@/lib/validation/schemas";
import { createDonationCheckoutSession } from "@/lib/stripe/checkout";

export async function createDonation(data: DonationValues & { locale: string }) {
  const parsed = donationSchema.parse(data);

  const { url, sessionId } = await createDonationCheckoutSession({
    amount: parsed.amount,
    recurring: parsed.recurring,
    email: parsed.email,
    donorName: parsed.donorName,
    message: parsed.message,
    locale: data.locale,
  });

  await db.donation.create({
    data: {
      email: parsed.email,
      amount: parsed.amount,
      recurring: parsed.recurring,
      donorName: parsed.donorName ?? null,
      message: parsed.message ?? null,
      stripeSessionId: sessionId,
      status: "PENDING",
    },
  });

  return { success: true, url };
}
