"use server";

import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";
import { disconnectGoogleCalendar } from "@/server/google-calendar/tokenManager";
import { batchSyncEvents, removeAllSyncedEvents } from "@/server/google-calendar/syncService";

export async function getUsers() {
  await requirePermission(PERMISSIONS.USERS_MANAGE);

  return db.user.findMany({
    include: {
      userRoles: {
        include: { role: true },
      },
    },
    orderBy: { createdAt: "desc" },
  }) as Promise<Array<{
    id: string;
    name: string | null;
    email: string;
    passwordHash: string | null;
    createdAt: Date;
    googleCalendarSyncEnabled: boolean;
    googleCalendarLastSync: Date | null;
    userRoles: { id: string; role: { id: string; name: string } }[];
  }>>;
}

export async function getUserById(id: string) {
  await requirePermission(PERMISSIONS.USERS_MANAGE);

  return db.user.findUnique({
    where: { id },
    include: {
      userRoles: { include: { role: true } },
      memberEventRegistrations: {
        where: { status: { not: "CANCELLED" } },
        include: {
          event: { select: { id: true, titleJa: true, titleEn: true, startsAt: true, status: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function getRoles() {
  await requirePermission(PERMISSIONS.USERS_MANAGE);

  return db.role.findMany({
    orderBy: { name: "asc" },
  });
}

export async function createUser(data: {
  email: string;
  name: string;
  password?: string;
  roleId: string;
}) {
  await requirePermission(PERMISSIONS.USERS_MANAGE);

  const email = data.email.toLowerCase().trim();

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return { success: false, error: "A user with this email already exists." };
  }

  const passwordHash = data.password
    ? await hash(data.password, 12)
    : null;

  const user = await db.user.create({
    data: {
      email,
      name: data.name,
      passwordHash,
      emailVerified: new Date(),
      userRoles: {
        create: { roleId: data.roleId },
      },
    },
  });

  revalidatePath("/admin/users");
  return { success: true, userId: user.id };
}

export async function updateUserRole(userId: string, roleId: string) {
  await requirePermission(PERMISSIONS.USERS_MANAGE);

  // Remove existing roles and assign new one
  await db.userRole.deleteMany({ where: { userId } });
  await db.userRole.create({ data: { userId, roleId } });

  revalidatePath("/admin/users");
  return { success: true };
}

export async function resetUserPassword(userId: string, newPassword: string) {
  await requirePermission(PERMISSIONS.USERS_MANAGE);

  if (newPassword.length < 8) {
    return { success: false, error: "Password must be at least 8 characters." };
  }

  const passwordHash = await hash(newPassword, 12);
  await db.user.update({
    where: { id: userId },
    data: { passwordHash },
  });

  revalidatePath("/admin/users");
  return { success: true };
}

export async function toggleSanghaMember(userId: string, value: boolean) {
  await requirePermission(PERMISSIONS.USERS_MANAGE);

  await db.user.update({
    where: { id: userId },
    data: { isSanghaMember: value },
  });

  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${userId}`);
  revalidatePath("/admin/members");
  return { success: true };
}

export async function deleteUser(userId: string) {
  const currentUser = await requirePermission(PERMISSIONS.USERS_MANAGE);

  if (currentUser.id === userId) {
    return { success: false, error: "You cannot delete your own account." };
  }

  await db.user.delete({ where: { id: userId } });

  revalidatePath("/admin/users");
  return { success: true };
}

export async function adminSyncUserCalendar(userId: string) {
  await requirePermission(PERMISSIONS.USERS_MANAGE);

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { googleCalendarSyncEnabled: true },
  });

  if (!user?.googleCalendarSyncEnabled) {
    return { success: false, error: "User has no Google Calendar connected." };
  }

  try {
    const result = await batchSyncEvents(userId);
    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/${userId}`);
    return { success: true, result };
  } catch {
    return { success: false, error: "Sync failed. The user may need to reconnect." };
  }
}

export async function adminDisconnectUserCalendar(
  userId: string,
  removeEvents: boolean
) {
  await requirePermission(PERMISSIONS.USERS_MANAGE);

  try {
    if (removeEvents) {
      await removeAllSyncedEvents(userId);
    }
    await disconnectGoogleCalendar(userId);
    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/${userId}`);
    return { success: true };
  } catch {
    return { success: false, error: "Failed to disconnect calendar." };
  }
}
