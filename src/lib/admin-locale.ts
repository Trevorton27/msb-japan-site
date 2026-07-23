import { cookies } from "next/headers";
import type { Locale } from "./i18n/config";

const COOKIE_NAME = "admin-locale";

export async function getAdminLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get(COOKIE_NAME)?.value;
  return value === "en" ? "en" : "ja";
}

/** Pick the localized field, falling back to the other language. */
export function t(locale: Locale, ja: string | null | undefined, en: string | null | undefined): string {
  if (locale === "en") return en || ja || "—";
  return ja || en || "—";
}
