import type { SocialProvider, SocialPublishResult } from "./types";

export class MockSocialProvider implements SocialProvider {
  async publish(params: {
    caption: string;
    mediaUrl?: string;
    accessToken: string;
    pageId?: string;
  }): Promise<SocialPublishResult> {
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 500));

    console.log("[MockSocialProvider] Publishing post:", {
      caption: params.caption.slice(0, 50) + "...",
      mediaUrl: params.mediaUrl,
      pageId: params.pageId,
    });

    return {
      success: true,
      platformPostId: `mock_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    };
  }
}
