"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addSocialAccount, removeSocialAccount } from "@/server/actions/social";

interface SocialAccount {
  id: string;
  platform: string;
  accountName: string;
  tokenExpiresAt: Date | null;
}

interface SocialAccountActionsProps {
  accounts: SocialAccount[];
}

export function SocialAccountActions({ accounts }: SocialAccountActionsProps) {
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const metaAppId = process.env.NEXT_PUBLIC_META_APP_ID;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  function connectMeta() {
    if (!metaAppId) {
      setError("META_APP_ID is not configured");
      return;
    }
    const redirectUri = `${appUrl}/api/social/meta/callback`;
    const scope = "pages_show_list,pages_read_engagement,pages_manage_posts,pages_read_user_content";
    window.location.href =
      `https://www.facebook.com/${GRAPH_API_VERSION}/dialog/oauth?` +
      new URLSearchParams({
        client_id: metaAppId,
        redirect_uri: redirectUri,
        scope,
        response_type: "code",
      });
  }

  async function handleManualAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    const result = await addSocialAccount({
      platform: fd.get("platform") as string,
      accountName: fd.get("accountName") as string,
      accessToken: fd.get("accessToken") as string,
      pageId: (fd.get("pageId") as string) || undefined,
    });
    if (result.success) {
      setShowForm(false);
      (e.target as HTMLFormElement).reset();
    }
  }

  async function handleRemove(id: string) {
    if (!confirm("Remove this social account? All linked posts will be deleted."))
      return;
    await removeSocialAccount(id);
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button size="sm" onClick={connectMeta}>
          Connect Facebook/Instagram
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowForm(!showForm)}
        >
          Add Manually
        </Button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {showForm && (
        <form
          onSubmit={handleManualAdd}
          className="flex flex-wrap items-end gap-3 rounded-lg border bg-white p-4"
        >
          <div>
            <Label htmlFor="platform">Platform</Label>
            <select
              id="platform"
              name="platform"
              required
              className="mt-1 rounded-md border px-3 py-2 text-sm"
            >
              <option value="facebook">Facebook</option>
              <option value="instagram">Instagram</option>
            </select>
          </div>
          <div>
            <Label htmlFor="accountName">Account Name</Label>
            <Input
              id="accountName"
              name="accountName"
              required
              className="w-40"
            />
          </div>
          <div>
            <Label htmlFor="accessToken">Access Token</Label>
            <Input
              id="accessToken"
              name="accessToken"
              required
              className="w-48"
              type="password"
            />
          </div>
          <div>
            <Label htmlFor="pageId">Page ID</Label>
            <Input id="pageId" name="pageId" className="w-36" />
          </div>
          <Button type="submit" size="sm">
            Add
          </Button>
        </form>
      )}

      {accounts.length > 0 && (
        <div className="rounded-lg border bg-white">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium">Account</th>
                <th className="px-4 py-2 text-left font-medium">Platform</th>
                <th className="px-4 py-2 text-left font-medium">Token Expires</th>
                <th className="px-4 py-2 text-left font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {accounts.map((account) => (
                <tr key={account.id}>
                  <td className="px-4 py-2 font-medium">{account.accountName}</td>
                  <td className="px-4 py-2 capitalize text-gray-600">
                    {account.platform}
                  </td>
                  <td className="px-4 py-2 text-gray-600">
                    {account.tokenExpiresAt
                      ? account.tokenExpiresAt.toLocaleDateString("ja-JP")
                      : "—"}
                  </td>
                  <td className="px-4 py-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleRemove(account.id)}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const GRAPH_API_VERSION = "v21.0";
