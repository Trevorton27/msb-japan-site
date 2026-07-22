"use client";

import { useState } from "react";
import { createUser } from "@/server/actions/users";
import { Button } from "@/components/ui/button";

type Role = { id: string; name: string };

export function AddUserForm({ roles }: { roles: Role[] }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const result = await createUser({
      email: form.get("email") as string,
      name: form.get("name") as string,
      password: (form.get("password") as string) || undefined,
      roleId: form.get("roleId") as string,
    });

    setPending(false);
    if (result.success) {
      setOpen(false);
    } else {
      setError(result.error ?? "Failed to create user.");
    }
  }

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)}>Add User</Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10">
      <div className="w-full max-w-md rounded-lg border bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold">Add User</h2>

        {error && (
          <p className="mb-3 rounded-md bg-red-50 p-2 text-sm text-red-600">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              name="name"
              required
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              name="email"
              type="email"
              required
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password <span className="text-gray-400">(optional — leave blank for Google-only)</span>
            </label>
            <input
              name="password"
              type="password"
              minLength={8}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              name="roleId"
              required
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            >
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                setError("");
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Creating..." : "Create User"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
