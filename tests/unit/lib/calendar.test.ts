import { describe, it, expect } from "vitest";
import { generateICS } from "@/lib/calendar";

describe("generateICS", () => {
  it("generates valid ICS content", () => {
    const ics = generateICS({
      title: "Meditation Session",
      description: "Weekly meditation",
      location: "Tashi Gachil",
      startsAt: new Date("2026-08-01T10:00:00Z"),
      endsAt: new Date("2026-08-01T12:00:00Z"),
    });

    expect(ics).toContain("BEGIN:VCALENDAR");
    expect(ics).toContain("END:VCALENDAR");
    expect(ics).toContain("SUMMARY:Meditation Session");
    expect(ics).toContain("DESCRIPTION:Weekly meditation");
    expect(ics).toContain("LOCATION:Tashi Gachil");
    expect(ics).toContain("DTSTART:");
    expect(ics).toContain("DTEND:");
  });

  it("escapes special characters", () => {
    const ics = generateICS({
      title: "Event; with, special chars",
      startsAt: new Date("2026-08-01T10:00:00Z"),
      endsAt: new Date("2026-08-01T12:00:00Z"),
    });

    expect(ics).toContain("SUMMARY:Event\\; with\\, special chars");
  });

  it("omits optional fields when not provided", () => {
    const ics = generateICS({
      title: "Simple Event",
      startsAt: new Date("2026-08-01T10:00:00Z"),
      endsAt: new Date("2026-08-01T12:00:00Z"),
    });

    expect(ics).not.toContain("DESCRIPTION:");
    expect(ics).not.toContain("LOCATION:");
    expect(ics).not.toContain("URL:");
  });
});
