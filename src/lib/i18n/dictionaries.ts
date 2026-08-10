import type { Locale } from "./config";
import type enJson from "@/dictionaries/en.json";

export type Dictionary = typeof enJson;

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  ja: () => import("@/dictionaries/ja.json").then((m) => m.default as unknown as Dictionary),
  en: () => import("@/dictionaries/en.json").then((m) => m.default),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}
