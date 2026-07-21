"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSocialPost } from "@/server/actions/social";

interface SocialAccount {
  id: string;
  platform: string;
  accountName: string;
}

interface ContentPost {
  id: string;
  titleJa: string;
  titleEn: string | null;
  excerptJa: string | null;
  imageUrl: string | null;
}

interface SocialComposerProps {
  accounts: SocialAccount[];
  contentPosts: ContentPost[];
}

export function SocialComposer({ accounts, contentPosts }: SocialComposerProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [selectedContent, setSelectedContent] = useState("");

  function handleContentSelect(contentId: string) {
    setSelectedContent(contentId);
    if (contentId) {
      const post = contentPosts.find((p) => p.id === contentId);
      if (post) {
        const caption = document.getElementById("caption") as HTMLTextAreaElement;
        const mediaUrl = document.getElementById("mediaUrl") as HTMLInputElement;
        if (caption) caption.value = post.excerptJa ?? post.titleJa;
        if (mediaUrl && post.imageUrl) mediaUrl.value = post.imageUrl;
      }
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const fd = new FormData(e.currentTarget);
    try {
      const result = await createSocialPost({
        socialAccountId: fd.get("accountId") as string,
        contentPostId: selectedContent || undefined,
        caption: fd.get("caption") as string,
        mediaUrl: (fd.get("mediaUrl") as string) || undefined,
        scheduledAt: (fd.get("scheduledAt") as string) || undefined,
      });

      if (!result.success) {
        setError("Failed to create post");
      } else {
        router.push("/admin/social");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create post");
    } finally {
      setSaving(false);
    }
  }

  if (accounts.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-6 text-center text-gray-500">
        No social accounts connected. Connect an account first.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <fieldset className="space-y-4 rounded-lg border p-4">
        <legend className="px-2 text-sm font-semibold">Post Details</legend>

        <div>
          <Label htmlFor="accountId">Account *</Label>
          <select
            id="accountId"
            name="accountId"
            required
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          >
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.accountName} ({account.platform})
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="contentPost">Link to Content (optional)</Label>
          <select
            id="contentPost"
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            value={selectedContent}
            onChange={(e) => handleContentSelect(e.target.value)}
          >
            <option value="">— None —</option>
            {contentPosts.map((post) => (
              <option key={post.id} value={post.id}>
                {post.titleJa}
                {post.titleEn ? ` / ${post.titleEn}` : ""}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="caption">Caption *</Label>
          <textarea
            id="caption"
            name="caption"
            required
            rows={5}
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            placeholder="Write your post caption..."
          />
        </div>

        <div>
          <Label htmlFor="mediaUrl">Media URL</Label>
          <Input
            id="mediaUrl"
            name="mediaUrl"
            type="url"
            placeholder="https://..."
          />
        </div>

        <div>
          <Label htmlFor="scheduledAt">Schedule (optional)</Label>
          <Input
            id="scheduledAt"
            name="scheduledAt"
            type="datetime-local"
          />
          <p className="mt-1 text-xs text-gray-500">
            Leave empty to save as draft for manual publishing.
          </p>
        </div>
      </fieldset>

      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Create Post"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/social")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
