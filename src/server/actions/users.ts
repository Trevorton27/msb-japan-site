"use server";

import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth/rbac";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function getUsers() {
  await requirePermission(PERMISSIONS.USERS_MANAGE);

  return db.user.findMany({
    include: {
      userRoles: {
        include: { role: true },
      },
    },
    orderBy: { createdAt: "desc" },
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

export async function deleteUser(userId: string) {
  const currentUser = await requirePermission(PERMISSIONS.USERS_MANAGE);

  if (currentUser.id === userId) {
    return { success: false, error: "You cannot delete your own account." };
  }

  await db.user.delete({ where: { id: userId } });

  revalidatePath("/admin/users");
  return { success: true };
}
