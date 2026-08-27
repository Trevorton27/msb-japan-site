"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { toggleSanghaMember } from "@/server/actions/users";
import { toast } from "sonner";

export function SanghaMemberToggle({
  userId,
  isSanghaMember,
}: {
  userId: string;
  isSanghaMember: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      await toggleSanghaMember(userId, !isSanghaMember);
      toast.success(
        isSanghaMember ? "Sangha member status removed" : "Sangha member status granted"
      );
      router.refresh();
    } catch {
      toast.error("Failed to update");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleToggle} disabled={loading} className="inline-flex items-center">
      <Badge
        variant="secondary"
        className={
          isSanghaMember
            ? "bg-green-100 text-green-700 cursor-pointer hover:bg-green-200"
            : "bg-gray-100 text-gray-500 cursor-pointer hover:bg-gray-200"
        }
      >
        {loading ? "..." : isSanghaMember ? "Yes" : "No"}
      </Badge>
    </button>
  );
}
