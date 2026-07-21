import type { Locale } from "./config";

type Dictionary = Record<string, Record<string, string>>;

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  ja: () => import("@/dictionaries/ja.json").then((m) => m.default),
  en: () => import("@/dictionaries/en.json").then((m) => m.default),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}
