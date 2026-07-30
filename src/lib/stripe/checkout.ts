"use server";

import { getStripe } from "./index";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

interface CreateDonationCheckoutParams {
  amount: number;
  recurring: boolean;
  email: string;
  donorName?: string;
  message?: string;
  designation?: "GENERAL" | "LIFE_RELEASE" | "DRUPCHO";
  locale: string;
}

const DESIGNATION_LABELS: Record<
  "GENERAL" | "LIFE_RELEASE" | "DRUPCHO",
  { ja: string; en: string }
> = {
  GENERAL: { ja: "寄付", en: "Donation" },
  LIFE_RELEASE: { ja: "放生会 お志", en: "Life-Release Offering" },
  DRUPCHO: { ja: "ドゥプチュ供養 お志", en: "Drupchö Offering" },
};

export async function createDonationCheckoutSession({
  amount,
  recurring,
  email,
  donorName,
  message,
  designation = "GENERAL",
  locale,
}: CreateDonationCheckoutParams) {
  const metadata: Record<string, string> = {
    type: "donation",
    donorName: donorName ?? "",
    message: message ?? "",
    designation,
  };
  const label = DESIGNATION_LABELS[designation] ?? DESIGNATION_LABELS.GENERAL;

  const successUrl = `${APP_URL}/${locale}/donate/thank-you?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${APP_URL}/${locale}/donate`;

  if (recurring) {
    const session = await getStripe().checkout.sessions.create({
      mode: "subscription",
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "jpy",
            product_data: {
              name:
                locale === "ja"
                  ? `マンガラ・シュリー・ブーティ・ジャパン 月額${label.ja}`
                  : `MSB Japan Monthly ${label.en}`,
            },
            unit_amount: amount,
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      metadata,
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return { url: session.url, sessionId: session.id };
  }

  const session = await getStripe().checkout.sessions.create({
    mode: "payment",
    customer_email: email,
    line_items: [
      {
        price_data: {
          currency: "jpy",
          product_data: {
            name:
              locale === "ja"
                ? "マンガラ・シュリー・ブーティ・ジャパン 寄付"
                : "MSB Japan Donation",
          },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    metadata,
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  return { url: session.url, sessionId: session.id };
}
