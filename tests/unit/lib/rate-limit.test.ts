import { describe, it, expect } from "vitest";
import { checkRateLimit } from "@/lib/security/rate-limit";

describe("checkRateLimit", () => {
  it("allows requests under the limit", () => {
    const key = `test-${Date.now()}-1`;
    expect(checkRateLimit(key, { max: 3, windowMs: 60000 })).toBe(true);
    expect(checkRateLimit(key, { max: 3, windowMs: 60000 })).toBe(true);
    expect(checkRateLimit(key, { max: 3, windowMs: 60000 })).toBe(true);
  });

  it("blocks requests over the limit", () => {
    const key = `test-${Date.now()}-2`;
    expect(checkRateLimit(key, { max: 2, windowMs: 60000 })).toBe(true);
    expect(checkRateLimit(key, { max: 2, windowMs: 60000 })).toBe(true);
    expect(checkRateLimit(key, { max: 2, windowMs: 60000 })).toBe(false);
  });

  it("uses separate limits for different keys", () => {
    const key1 = `test-${Date.now()}-3a`;
    const key2 = `test-${Date.now()}-3b`;
    expect(checkRateLimit(key1, { max: 1, windowMs: 60000 })).toBe(true);
    expect(checkRateLimit(key1, { max: 1, windowMs: 60000 })).toBe(false);
    expect(checkRateLimit(key2, { max: 1, windowMs: 60000 })).toBe(true);
  });
});
