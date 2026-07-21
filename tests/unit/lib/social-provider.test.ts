import { describe, it, expect } from "vitest";
import { MockSocialProvider } from "@/lib/social/mock-provider";

describe("MockSocialProvider", () => {
  const provider = new MockSocialProvider();

  it("publishes a text post successfully", async () => {
    const result = await provider.publish({
      caption: "Test post caption",
      accessToken: "mock-token",
    });

    expect(result.success).toBe(true);
    expect(result.platformPostId).toBeDefined();
    expect(result.platformPostId).toMatch(/^mock_/);
  });

  it("publishes a post with media successfully", async () => {
    const result = await provider.publish({
      caption: "Post with image",
      mediaUrl: "https://example.com/image.jpg",
      accessToken: "mock-token",
      pageId: "page-123",
    });

    expect(result.success).toBe(true);
    expect(result.platformPostId).toBeDefined();
  });

  it("returns unique platform post IDs", async () => {
    const result1 = await provider.publish({
      caption: "Post 1",
      accessToken: "mock-token",
    });
    const result2 = await provider.publish({
      caption: "Post 2",
      accessToken: "mock-token",
    });

    expect(result1.platformPostId).not.toBe(result2.platformPostId);
  });
});
