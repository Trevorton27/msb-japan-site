import { cookies } from "next/headers";
import type { Locale } from "./i18n/config";
export { t } from "./locale-utils";

const COOKIE_NAME = "admin-locale";

export async function getAdminLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get(COOKIE_NAME)?.value;
  return value === "en" ? "en" : "ja";
}
