import type { Locale } from "./i18n/config";

/** Pick the localized field, falling back to the other language. */
export function t(locale: Locale, ja: string | null | undefined, en: string | null | undefined): string {
  if (locale === "en") return en || ja || "—";
  return ja || en || "—";
}
