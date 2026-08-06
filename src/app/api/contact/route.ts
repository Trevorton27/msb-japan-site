import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { contactFormSchema } from "@/lib/validation/schemas";
import { sendContactFormNotification } from "@/lib/email";

const RATE_LIMIT_MAP = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = RATE_LIMIT_MAP.get(ip);

  if (!entry || now > entry.resetAt) {
    RATE_LIMIT_MAP.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count++;
  return true;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = contactFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try later." },
        { status: 429 },
      );
    }

    await db.contactMessage.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        subject: parsed.data.subject,
        body: parsed.data.body,
      },
    });

    try {
      const adminEmail = process.env.ADMIN_EMAIL ?? process.env.BREVO_SENDER_EMAIL!;
      const locale = typeof body.locale === "string" ? body.locale : "en";
      await sendContactFormNotification(
        {
          name: parsed.data.name,
          email: parsed.data.email,
          phone: parsed.data.phone,
          subject: parsed.data.subject,
          message: parsed.data.body,
        },
        adminEmail,
        locale,
      );
    } catch (err) {
      console.error("Failed to send contact notification email:", err);
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to submit contact form" },
      { status: 500 },
    );
  }
}
