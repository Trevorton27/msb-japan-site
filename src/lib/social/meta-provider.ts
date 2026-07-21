import type { SocialProvider, SocialPublishResult } from "./types";

const GRAPH_API_VERSION = "v21.0";
const GRAPH_API_BASE = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

export class MetaSocialProvider implements SocialProvider {
  async publish(params: {
    caption: string;
    mediaUrl?: string;
    accessToken: string;
    pageId?: string;
  }): Promise<SocialPublishResult> {
    if (!params.pageId) {
      return { success: false, error: "Page ID is required for Meta publishing" };
    }

    try {
      if (params.mediaUrl) {
        // Photo post
        const response = await fetch(
          `${GRAPH_API_BASE}/${params.pageId}/photos`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              url: params.mediaUrl,
              message: params.caption,
              access_token: params.accessToken,
            }),
          }
        );
        const data = await response.json();
        if (data.error) {
          return { success: false, error: data.error.message };
        }
        return { success: true, platformPostId: data.id };
      }

      // Text-only post
      const response = await fetch(
        `${GRAPH_API_BASE}/${params.pageId}/feed`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: params.caption,
            access_token: params.accessToken,
          }),
        }
      );
      const data = await response.json();
      if (data.error) {
        return { success: false, error: data.error.message };
      }
      return { success: true, platformPostId: data.id };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Meta API error",
      };
    }
  }

  async refreshToken(params: {
    refreshToken: string;
    appId: string;
    appSecret: string;
  }): Promise<{ accessToken: string; expiresAt: Date } | null> {
    try {
      const response = await fetch(
        `${GRAPH_API_BASE}/oauth/access_token?` +
          new URLSearchParams({
            grant_type: "fb_exchange_token",
            client_id: params.appId,
            client_secret: params.appSecret,
            fb_exchange_token: params.refreshToken,
          })
      );
      const data = await response.json();
      if (data.error) return null;

      return {
        accessToken: data.access_token,
        expiresAt: new Date(Date.now() + (data.expires_in ?? 5184000) * 1000),
      };
    } catch {
      return null;
    }
  }
}
