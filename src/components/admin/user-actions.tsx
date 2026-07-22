"use client";

import { useState } from "react";
import { updateUserRole, resetUserPassword, deleteUser } from "@/server/actions/users";
import { Button } from "@/components/ui/button";

type Role = { id: string; name: string };
type User = {
  id: string;
  name: string | null;
  email: string;
  passwordHash: string | null;
  userRoles: { id: string; role: Role }[];
};

export function UserActions({ user, roles }: { user: User; roles: Role[] }) {
  const [showRoleEdit, setShowRoleEdit] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function handleRoleChange(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const form = new FormData(e.currentTarget);
    await updateUserRole(user.id, form.get("roleId") as string);
    setPending(false);
    setShowRoleEdit(false);
  }

  async function handlePasswordReset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const result = await resetUserPassword(user.id, form.get("password") as string);
    setPending(false);
    if (result.success) {
      setShowPasswordReset(false);
    } else {
      setError(result.error ?? "Failed to reset password.");
    }
  }

  async function handleDelete() {
    setPending(true);
    setError("");
    const result = await deleteUser(user.id);
    setPending(false);
    if (!result.success) {
      setError(result.error ?? "Failed to delete user.");
    }
    setShowDelete(false);
  }

  return (
    <>
      <div className="flex justify-end gap-1">
        <Button variant="ghost" size="xs" onClick={() => setShowRoleEdit(true)}>
          Role
        </Button>
        <Button variant="ghost" size="xs" onClick={() => setShowPasswordReset(true)}>
          Password
        </Button>
        <Button variant="destructive" size="xs" onClick={() => setShowDelete(true)}>
          Delete
        </Button>
      </div>

      {error && (
        <p className="mt-1 text-right text-xs text-red-600">{error}</p>
      )}

      {showRoleEdit && (
        <Modal onClose={() => setShowRoleEdit(false)}>
          <h3 className="mb-3 font-semibold">Change Role — {user.email}</h3>
          <form onSubmit={handleRoleChange} className="space-y-3">
            <select
              name="roleId"
              defaultValue={user.userRoles[0]?.role.id}
              className="w-full rounded-md border px-3 py-2 text-sm"
            >
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowRoleEdit(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={pending}>
                {pending ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {showPasswordReset && (
        <Modal onClose={() => setShowPasswordReset(false)}>
          <h3 className="mb-3 font-semibold">Reset Password — {user.email}</h3>
          <form onSubmit={handlePasswordReset} className="space-y-3">
            <input
              name="password"
              type="password"
              required
              minLength={8}
              placeholder="New password (min 8 chars)"
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowPasswordReset(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={pending}>
                {pending ? "Resetting..." : "Reset Password"}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {showDelete && (
        <Modal onClose={() => setShowDelete(false)}>
          <h3 className="mb-3 font-semibold">Delete User</h3>
          <p className="mb-4 text-sm text-gray-600">
            Are you sure you want to delete <strong>{user.email}</strong>? This cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowDelete(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={pending}>
              {pending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-lg border bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
