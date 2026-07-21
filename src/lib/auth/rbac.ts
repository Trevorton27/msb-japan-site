import { auth } from "./index";
import type { PermissionKey, RoleName } from "./permissions";

export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function requirePermission(permission: PermissionKey) {
  const user = await requireAuth();
  if (!user.permissions.includes(permission)) {
    throw new Error("Forbidden");
  }
  return user;
}

export async function hasPermission(permission: PermissionKey) {
  const user = await getCurrentUser();
  return user?.permissions.includes(permission) ?? false;
}

export async function hasRole(role: RoleName) {
  const user = await getCurrentUser();
  return user?.roles.includes(role) ?? false;
}
