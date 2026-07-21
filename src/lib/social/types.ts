export interface SocialPublishResult {
  success: boolean;
  platformPostId?: string;
  error?: string;
}

export interface SocialProvider {
  publish(params: {
    caption: string;
    mediaUrl?: string;
    accessToken: string;
    pageId?: string;
  }): Promise<SocialPublishResult>;

  refreshToken?(params: {
    refreshToken: string;
    appId: string;
    appSecret: string;
  }): Promise<{ accessToken: string; expiresAt: Date } | null>;
}
