import { describe, it, expect } from "vitest";
import { parseBio } from "@/lib/content/bio";

describe("parseBio", () => {
  it("splits paragraphs on blank lines", () => {
    expect(parseBio("One.\n\nTwo.")).toEqual([
      { kind: "paragraph", text: "One." },
      { kind: "paragraph", text: "Two." },
    ]);
  });

  it("treats a legacy single-paragraph bio as one paragraph", () => {
    expect(parseBio("Just one bio.")).toEqual([
      { kind: "paragraph", text: "Just one bio." },
    ]);
  });

  it("parses tagline, heading, and quote with source", () => {
    const bio =
      "+ A lineage holder.\n\n## On the teacher\n\n> First.\n> Second.\n~ — from a book";
    expect(parseBio(bio)).toEqual([
      { kind: "tagline", text: "A lineage holder." },
      { kind: "heading", text: "On the teacher" },
      {
        kind: "quote",
        paragraphs: ["First.", "Second."],
        source: "— from a book",
      },
    ]);
  });

  it("allows a quote without a source", () => {
    expect(parseBio("> Only a quote.")).toEqual([
      { kind: "quote", paragraphs: ["Only a quote."] },
    ]);
  });
});

describe("seeded teacher bios", () => {
  it("parse without leaking markers into rendered text", async () => {
    const { legacyTeachers } =
      await import("../../../prisma/seed-data/legacy-content");
    for (const t of legacyTeachers) {
      for (const bio of [t.bioJa, t.bioEn]) {
        for (const block of parseBio(bio)) {
          const texts =
            block.kind === "quote"
              ? [...block.paragraphs, block.source ?? ""]
              : [block.text];
          for (const text of texts) expect(text).not.toMatch(/^(\+|##|>|~) /);
        }
      }
    }
  });

  it("keeps JA and EN bios structurally aligned", async () => {
    const { legacyTeachers } =
      await import("../../../prisma/seed-data/legacy-content");
    for (const t of legacyTeachers) {
      const kinds = (bio: string) => parseBio(bio).map((b) => b.kind);
      expect(kinds(t.bioEn), t.slugJa).toEqual(kinds(t.bioJa));
    }
  });
});
