export const locales = ["en", "ko", "ja", "es", "fr", "de"] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: "English",
  ko: "한국어",
  ja: "日本語",
  es: "Español",
  fr: "Français",
  de: "Deutsch"
};

export const openGraphLocales: Record<Locale, string> = {
  en: "en_US",
  ko: "ko_KR",
  ja: "ja_JP",
  es: "es_ES",
  fr: "fr_FR",
  de: "de_DE"
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
