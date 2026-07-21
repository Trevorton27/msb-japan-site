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
});
