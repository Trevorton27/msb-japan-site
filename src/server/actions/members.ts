"use server";

import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth/rbac";
import { PERMISSIONS, ROLES } from "@/lib/auth/permissions";
import { revalidatePath } from "next/cache";

export async function getMembersAdmin() {
  await requirePermission(PERMISSIONS.USERS_MANAGE);

  const memberRole = await db.role.findUnique({ where: { name: ROLES.MEMBER } });
  if (!memberRole) return [];

  return db.user.findMany({
    where: {
      userRoles: { some: { roleId: memberRole.id } },
    },
    include: {
      userRoles: { include: { role: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAllUsersWithMemberStatus() {
  await requirePermission(PERMISSIONS.USERS_MANAGE);

  const memberRole = await db.role.findUnique({ where: { name: ROLES.MEMBER } });

  return db.user.findMany({
    include: {
      userRoles: { include: { role: true } },
    },
    orderBy: { createdAt: "desc" },
  }).then((users) =>
    users.map((u) => ({
      ...u,
      isMember: memberRole
        ? u.userRoles.some((ur) => ur.roleId === memberRole.id)
        : false,
    }))
  );
}

export async function grantMemberAccess(userId: string) {
  await requirePermission(PERMISSIONS.USERS_MANAGE);

  const memberRole = await db.role.findUnique({ where: { name: ROLES.MEMBER } });
  if (!memberRole) return { success: false, error: "Member role not found. Run the seed script." };

  await db.userRole.upsert({
    where: { userId_roleId: { userId, roleId: memberRole.id } },
    update: {},
    create: { userId, roleId: memberRole.id },
  });

  revalidatePath("/admin/members");
  return { success: true };
}

export async function revokeMemberAccess(userId: string) {
  await requirePermission(PERMISSIONS.USERS_MANAGE);

  const memberRole = await db.role.findUnique({ where: { name: ROLES.MEMBER } });
  if (!memberRole) return { success: false, error: "Member role not found." };

  await db.userRole.deleteMany({
    where: { userId, roleId: memberRole.id },
  });

  revalidatePath("/admin/members");
  return { success: true };
}
