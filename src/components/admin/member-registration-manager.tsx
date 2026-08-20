"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  adminRegisterMember,
  adminRemoveMemberRegistration,
} from "@/server/actions/member-event-registrations";

interface Member {
  id: string;
  name: string | null;
  email: string;
}

interface Registration {
  id: string;
  userId: string;
  userName: string;
  status: string;
}

interface Props {
  eventId: string;
  members: Member[];
  registrations: Registration[];
}

export function MemberRegistrationManager({
  eventId,
  members,
  registrations,
}: Props) {
  const router = useRouter();
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [adding, setAdding] = useState(false);

  const registeredUserIds = new Set(registrations.map((r) => r.userId));
  const availableMembers = members.filter((m) => !registeredUserIds.has(m.id));

  const handleAdd = async () => {
    if (!selectedMemberId) return;
    try {
      setAdding(true);
      const result = await adminRegisterMember(eventId, selectedMemberId);
      if (result.success) {
        toast.success("Member registered");
        setSelectedMemberId("");
        router.refresh();
      }
    } catch {
      toast.error("Failed to register member");
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = async (userId: string) => {
    try {
      const result = await adminRemoveMemberRegistration(eventId, userId);
      if (result.success) {
        toast.success("Registration removed");
        router.refresh();
      }
    } catch {
      toast.error("Failed to remove registration");
    }
  };

  return (
    <div className="mb-8 rounded-lg border bg-white p-4">
      <h2 className="mb-3 text-sm font-semibold text-gray-500">
        Member Registrations
      </h2>

      {registrations.length > 0 && (
        <ul className="mb-4 space-y-2">
          {registrations.map((reg) => (
            <li
              key={reg.id}
              className="flex items-center justify-between rounded border px-3 py-2 text-sm"
            >
              <span>{reg.userName}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">{reg.status}</span>
                <button
                  onClick={() => handleRemove(reg.userId)}
                  className="text-xs text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {availableMembers.length > 0 && (
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm"
            >
              <option value="">Select a member...</option>
              {availableMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name ?? m.email} ({m.email})
                </option>
              ))}
            </select>
          </div>
          <Button
            onClick={handleAdd}
            disabled={!selectedMemberId || adding}
            size="sm"
          >
            {adding ? "Adding..." : "Add Member"}
          </Button>
        </div>
      )}

      {availableMembers.length === 0 && registrations.length === 0 && (
        <p className="text-sm text-gray-500">No members available.</p>
      )}
    </div>
  );
}
