import { describe, it, expect } from "vitest";
import { isValidLocale, locales, defaultLocale } from "@/lib/i18n/config";

describe("i18n config", () => {
  it("has ja and en locales", () => {
    expect(locales).toEqual(["ja", "en"]);
  });

  it("defaults to ja", () => {
    expect(defaultLocale).toBe("ja");
  });

  it("validates ja as valid locale", () => {
    expect(isValidLocale("ja")).toBe(true);
  });

  it("validates en as valid locale", () => {
    expect(isValidLocale("en")).toBe(true);
  });

  it("rejects invalid locale", () => {
    expect(isValidLocale("fr")).toBe(false);
    expect(isValidLocale("")).toBe(false);
    expect(isValidLocale("JA")).toBe(false);
  });
});
