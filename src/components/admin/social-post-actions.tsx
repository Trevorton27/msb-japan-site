"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { publishSocialPost, deleteSocialPost } from "@/server/actions/social";

interface SocialPostActionsProps {
  postId: string;
  status: string;
}

export function SocialPostActions({ postId, status }: SocialPostActionsProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handlePublish() {
    setLoading(true);
    setError("");
    const result = await publishSocialPost(postId);
    if (!result.success) {
      setError(result.error ?? "Failed to publish");
    }
    setLoading(false);
  }

  async function handleDelete() {
    if (!confirm("Delete this post?")) return;
    setLoading(true);
    await deleteSocialPost(postId);
    setLoading(false);
  }

  return (
    <div className="flex items-center gap-2">
      {error && <span className="text-xs text-red-600">{error}</span>}

      {(status === "draft" || status === "scheduled" || status === "failed") && (
        <Button
          size="sm"
          disabled={loading}
          onClick={handlePublish}
        >
          {loading ? "Publishing..." : "Publish Now"}
        </Button>
      )}

      {status !== "published" && (
        <Button
          size="sm"
          variant="destructive"
          disabled={loading}
          onClick={handleDelete}
        >
          Delete
        </Button>
      )}
    </div>
  );
}
