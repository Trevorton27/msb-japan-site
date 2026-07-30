import { describe, it, expect } from "vitest";
import { eventRegistrationSchema } from "@/lib/validation/schemas";

describe("eventRegistrationSchema", () => {
  it("accepts a registration with only the required fields", () => {
    const result = eventRegistrationSchema.safeParse({
      email: "student@example.com",
      attendees: [{ nameJa: "田中太郎" }],
    });
    expect(result.success).toBe(true);
  });

  // The form submits "" for inputs the user left blank; those must not fail
  // format validation on optional fields.
  it("treats blank optional attendee fields as absent", () => {
    const result = eventRegistrationSchema.safeParse({
      email: "student@example.com",
      attendees: [{ nameJa: "田中太郎", nameEn: "", email: "" }],
      notes: "",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.attendees[0]?.email).toBeUndefined();
      expect(result.data.attendees[0]?.nameEn).toBeUndefined();
      expect(result.data.notes).toBeUndefined();
    }
  });

  it("keeps a filled-in attendee email", () => {
    const result = eventRegistrationSchema.safeParse({
      email: "student@example.com",
      attendees: [{ nameJa: "田中太郎", email: "taro@example.com" }],
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.attendees[0]?.email).toBe("taro@example.com");
    }
  });

  it("still rejects a malformed attendee email", () => {
    const result = eventRegistrationSchema.safeParse({
      email: "student@example.com",
      attendees: [{ nameJa: "田中太郎", email: "not-an-email" }],
    });
    expect(result.success).toBe(false);
  });

  it("rejects a registration with no attendees", () => {
    const result = eventRegistrationSchema.safeParse({
      email: "student@example.com",
      attendees: [],
    });
    expect(result.success).toBe(false);
  });

  it("rejects an attendee with no Japanese name", () => {
    const result = eventRegistrationSchema.safeParse({
      email: "student@example.com",
      attendees: [{ nameJa: "" }],
    });
    expect(result.success).toBe(false);
  });
});
