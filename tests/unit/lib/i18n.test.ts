import { describe, it, expect } from "vitest";
import { isValidLocale, locales, defaultLocale } from "@/lib/i18n/config";
import ja from "@/dictionaries/ja.json";
import en from "@/dictionaries/en.json";

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

describe("dictionaries", () => {
  function keyPaths(value: unknown, prefix = ""): string[] {
    if (Array.isArray(value)) return [`${prefix}[${value.length}]`];
    if (value && typeof value === "object") {
      return Object.entries(value).flatMap(([k, v]) =>
        keyPaths(v, prefix ? `${prefix}.${k}` : k)
      );
    }
    return [prefix];
  }

  it("ja.json and en.json have identical key sets", () => {
    expect(keyPaths(ja).sort()).toEqual(keyPaths(en).sort());
  });
});
