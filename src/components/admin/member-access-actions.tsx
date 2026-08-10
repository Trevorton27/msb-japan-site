"use client";

import { useState } from "react";
import { grantMemberAccess, revokeMemberAccess } from "@/server/actions/members";
import { Button } from "@/components/ui/button";

export function MemberAccessActions({
  userId,
  isMember,
  grantLabel,
  revokeLabel,
}: {
  userId: string;
  isMember: boolean;
  grantLabel: string;
  revokeLabel: string;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [memberState, setMemberState] = useState(isMember);

  async function handleGrant() {
    setPending(true);
    setError("");
    const result = await grantMemberAccess(userId);
    if (result.success) {
      setMemberState(true);
    } else {
      setError(result.error ?? "Failed.");
    }
    setPending(false);
  }

  async function handleRevoke() {
    setPending(true);
    setError("");
    const result = await revokeMemberAccess(userId);
    if (result.success) {
      setMemberState(false);
    } else {
      setError(result.error ?? "Failed.");
    }
    setPending(false);
  }

  return (
    <div>
      {error && <p className="mb-1 text-xs text-red-600">{error}</p>}
      {memberState ? (
        <Button
          variant="ghost"
          size="xs"
          onClick={handleRevoke}
          disabled={pending}
          className="text-red-600 hover:text-red-700"
        >
          {pending ? "..." : revokeLabel}
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="xs"
          onClick={handleGrant}
          disabled={pending}
          className="text-green-700 hover:text-green-800"
        >
          {pending ? "..." : grantLabel}
        </Button>
      )}
    </div>
  );
}
