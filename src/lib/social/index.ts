import type { SocialProvider } from "./types";
import { MockSocialProvider } from "./mock-provider";
import { MetaSocialProvider } from "./meta-provider";

export function getSocialProvider(platform: string): SocialProvider {
  if (process.env.NODE_ENV === "development" && !process.env.META_APP_ID) {
    return new MockSocialProvider();
  }

  switch (platform) {
    case "facebook":
    case "instagram":
      return new MetaSocialProvider();
    default:
      return new MockSocialProvider();
  }
}

export type { SocialProvider, SocialPublishResult } from "./types";
