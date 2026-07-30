import { describe, it, expect } from "vitest";
import { donationSchema } from "@/lib/validation/schemas";

describe("donationSchema", () => {
  it("validates a valid one-time donation", () => {
    const result = donationSchema.safeParse({
      email: "donor@example.com",
      amount: 5000,
      recurring: false,
    });
    expect(result.success).toBe(true);
  });

  it("validates a recurring donation with optional fields", () => {
    const result = donationSchema.safeParse({
      email: "donor@example.com",
      amount: 10000,
      recurring: true,
      donorName: "Test Donor",
      message: "Keep up the great work",
    });
    expect(result.success).toBe(true);
  });

  it("rejects amount below minimum (100 yen)", () => {
    const result = donationSchema.safeParse({
      email: "donor@example.com",
      amount: 50,
      recurring: false,
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = donationSchema.safeParse({
      email: "not-an-email",
      amount: 1000,
      recurring: false,
    });
    expect(result.success).toBe(false);
  });

  it("rejects non-integer amount", () => {
    const result = donationSchema.safeParse({
      email: "donor@example.com",
      amount: 1000.5,
      recurring: false,
    });
    expect(result.success).toBe(false);
  });

  it("defaults recurring to false", () => {
    const result = donationSchema.safeParse({
      email: "donor@example.com",
      amount: 3000,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.recurring).toBe(false);
    }
  });

  it("defaults designation to the general fund", () => {
    const result = donationSchema.safeParse({
      email: "donor@example.com",
      amount: 3000,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.designation).toBe("GENERAL");
    }
  });

  it("accepts a life-release offering with a prayer request", () => {
    const result = donationSchema.safeParse({
      email: "donor@example.com",
      amount: 2000,
      designation: "LIFE_RELEASE",
      message: "父の一日も早い病気からの回復を祈念します。田中一郎",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.designation).toBe("LIFE_RELEASE");
    }
  });

  it("accepts a drupcho offering", () => {
    const result = donationSchema.safeParse({
      email: "donor@example.com",
      amount: 4000,
      designation: "DRUPCHO",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an unknown designation", () => {
    const result = donationSchema.safeParse({
      email: "donor@example.com",
      amount: 2000,
      designation: "BUILDING_FUND",
    });
    expect(result.success).toBe(false);
  });
});
