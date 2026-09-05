"use client";

import { useState } from "react";
import Link from "next/link";
import {
  updateUserRole,
  resetUserPassword,
  deleteUser,
  adminSyncUserCalendar,
  adminDisconnectUserCalendar,
} from "@/server/actions/users";
import { Button } from "@/components/ui/button";

type Role = { id: string; name: string };
type User = {
  id: string;
  name: string | null;
  email: string;
  passwordHash: string | null;
  googleCalendarSyncEnabled: boolean;
  googleCalendarLastSync: Date | null;
  userRoles: { id: string; role: Role }[];
};

export function UserActions({ user, roles }: { user: User; roles: Role[] }) {
  const [showRoleEdit, setShowRoleEdit] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showCalendarDisconnect, setShowCalendarDisconnect] = useState(false);
  const [removeEvents, setRemoveEvents] = useState(false);
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

  async function handleSync() {
    setPending(true);
    setError("");
    const result = await adminSyncUserCalendar(user.id);
    setPending(false);
    if (!result.success) {
      setError(result.error ?? "Sync failed.");
    }
  }

  async function handleDisconnect() {
    setPending(true);
    setError("");
    const result = await adminDisconnectUserCalendar(user.id, removeEvents);
    setPending(false);
    if (!result.success) {
      setError(result.error ?? "Disconnect failed.");
    }
    setShowCalendarDisconnect(false);
    setRemoveEvents(false);
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
        <Link href={`/admin/users/${user.id}`}>
          <Button variant="ghost" size="xs">
            Profile
          </Button>
        </Link>
        <Button variant="ghost" size="xs" onClick={() => setShowRoleEdit(true)}>
          Role
        </Button>
        <Button variant="ghost" size="xs" onClick={() => setShowPasswordReset(true)}>
          Password
        </Button>
        {user.googleCalendarSyncEnabled && (
          <>
            <Button variant="ghost" size="xs" onClick={handleSync} disabled={pending}>
              {pending ? "Syncing..." : "Sync Cal"}
            </Button>
            <Button variant="ghost" size="xs" onClick={() => setShowCalendarDisconnect(true)}>
              Disconnect Cal
            </Button>
          </>
        )}
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

      {showCalendarDisconnect && (
        <Modal onClose={() => setShowCalendarDisconnect(false)}>
          <h3 className="mb-3 font-semibold">Disconnect Calendar — {user.email}</h3>
          <p className="mb-4 text-sm text-gray-600">
            This will remove the Google Calendar connection for this user.
          </p>
          <label className="mb-4 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={removeEvents}
              onChange={(e) => setRemoveEvents(e.target.checked)}
            />
            Also remove synced events from their Google Calendar
          </label>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowCalendarDisconnect(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDisconnect} disabled={pending}>
              {pending ? "Disconnecting..." : "Disconnect"}
            </Button>
          </div>
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
        role="dialog"
        aria-modal="true"
        className="w-full max-w-sm rounded-lg border bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
