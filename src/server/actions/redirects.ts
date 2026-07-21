"use server";

import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const redirectSchema = z.object({
  fromPath: z.string().min(1).startsWith("/"),
  toPath: z.string().min(1).startsWith("/"),
  statusCode: z.number().int().min(301).max(308).default(301),
  active: z.boolean().default(true),
});

export async function getAllRedirects() {
  await requirePermission(PERMISSIONS.SETTINGS_MANAGE);
  return db.redirect.findMany({ orderBy: { fromPath: "asc" } });
}

export async function createRedirect(data: z.infer<typeof redirectSchema>) {
  await requirePermission(PERMISSIONS.SETTINGS_MANAGE);
  const parsed = redirectSchema.parse(data);

  if (parsed.fromPath === parsed.toPath) {
    return { success: false, error: "From and To paths cannot be the same" };
  }

  // Loop detection: check if toPath already redirects somewhere
  const existing = await db.redirect.findUnique({
    where: { fromPath: parsed.toPath },
  });
  if (existing) {
    return {
      success: false,
      error: `Loop detected: ${parsed.toPath} already redirects to ${existing.toPath}`,
    };
  }

  await db.redirect.create({ data: parsed });
  revalidatePath("/admin/redirects");
  return { success: true };
}

export async function deleteRedirect(id: string) {
  await requirePermission(PERMISSIONS.SETTINGS_MANAGE);
  await db.redirect.delete({ where: { id } });
  revalidatePath("/admin/redirects");
  return { success: true };
}

export async function importRedirectsFromCSV(csv: string) {
  await requirePermission(PERMISSIONS.SETTINGS_MANAGE);

  const lines = csv.trim().split("\n").slice(1); // skip header
  let imported = 0;
  const errors: string[] = [];

  for (const line of lines) {
    const parts = line.split(",").map((s) => s.trim());
    const fromPath = parts[0];
    const toPath = parts[1];
    const statusCode = parts[2] ? parseInt(parts[2], 10) : 301;

    if (!fromPath || !toPath) {
      errors.push(`Invalid line: ${line}`);
      continue;
    }

    try {
      await db.redirect.upsert({
        where: { fromPath },
        update: { toPath, statusCode },
        create: { fromPath, toPath, statusCode },
      });
      imported++;
    } catch {
      errors.push(`Failed: ${fromPath}`);
    }
  }

  revalidatePath("/admin/redirects");
  return { success: true, imported, errors };
}
