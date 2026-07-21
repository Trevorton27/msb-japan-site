import { describe, it, expect } from "vitest";
import {
  PERMISSIONS,
  ALL_PERMISSIONS,
  ROLES,
  ROLE_PERMISSIONS,
} from "@/lib/auth/permissions";

describe("RBAC permissions", () => {
  it("defines 14 permissions", () => {
    expect(ALL_PERMISSIONS).toHaveLength(14);
  });

  it("defines 6 roles", () => {
    expect(Object.keys(ROLES)).toHaveLength(6);
  });

  it("Administrator has all permissions", () => {
    expect(ROLE_PERMISSIONS[ROLES.ADMINISTRATOR]).toEqual(ALL_PERMISSIONS);
  });

  it("Editor has content permissions", () => {
    const editorPerms = ROLE_PERMISSIONS[ROLES.EDITOR];
    expect(editorPerms).toContain(PERMISSIONS.CONTENT_READ);
    expect(editorPerms).toContain(PERMISSIONS.CONTENT_PUBLISH);
    expect(editorPerms).not.toContain(PERMISSIONS.USERS_MANAGE);
  });

  it("Analyst has read-only permissions", () => {
    const analystPerms = ROLE_PERMISSIONS[ROLES.ANALYST];
    expect(analystPerms).toContain(PERMISSIONS.ANALYTICS_READ);
    expect(analystPerms).not.toContain(PERMISSIONS.CONTENT_EDIT);
  });

  it("all permission keys use dot notation", () => {
    for (const perm of ALL_PERMISSIONS) {
      expect(perm).toMatch(/^[a-z]+\.[a-z]+$/);
    }
  });
});
