"use server";

import { db } from "@/lib/db";
import { contactFormSchema } from "@/lib/validation/schemas";
import type { ContactFormValues } from "@/lib/validation/schemas";
import { requirePermission } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { sendContactFormNotification } from "@/lib/email";

const RATE_LIMIT_MAP = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

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

export async function submitContactForm(data: ContactFormValues, locale: string = "en") {
  const parsed = contactFormSchema.parse(data);

  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (!checkRateLimit(ip)) {
    return { success: false, error: "Too many requests. Please try later." };
  }

  await db.contactMessage.create({
    data: {
      name: parsed.name,
      email: parsed.email,
      phone: parsed.phone,
      subject: parsed.subject,
      body: parsed.body,
    },
  });

  try {
    const adminEmail = process.env.ADMIN_EMAIL ?? process.env.BREVO_SENDER_EMAIL!;
    await sendContactFormNotification(
      {
        name: parsed.name,
        email: parsed.email,
        phone: parsed.phone,
        subject: parsed.subject,
        message: parsed.body,
      },
      adminEmail,
      locale,
    );
  } catch (err) {
    console.error("Failed to send contact notification email:", err);
    // Don't fail the submission if email fails — message is already saved
  }

  return { success: true };
}

export async function getContactMessages(status?: string) {
  await requirePermission(PERMISSIONS.CONTACTS_MANAGE);

  return db.contactMessage.findMany({
    where: status ? { status: status as "NEW" | "READ" | "REPLIED" | "ARCHIVED" } : undefined,
    include: { notes: { include: { author: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateContactStatus(
  id: string,
  status: "NEW" | "READ" | "REPLIED" | "ARCHIVED"
) {
  await requirePermission(PERMISSIONS.CONTACTS_MANAGE);

  await db.contactMessage.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/admin/contacts");
  return { success: true };
}

export async function addContactNote(messageId: string, body: string) {
  await requirePermission(PERMISSIONS.CONTACTS_MANAGE);

  const user = await requirePermission(PERMISSIONS.CONTACTS_MANAGE);

  await db.contactMessageNote.create({
    data: {
      messageId,
      authorId: user.id,
      body,
    },
  });

  revalidatePath("/admin/contacts");
  return { success: true };
}
