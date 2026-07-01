import type { Locale } from "./locales";
import { enDictionary, type Dictionary } from "./dictionaries/en";
import { koDictionary } from "./dictionaries/ko";
import { jaDictionary } from "./dictionaries/ja";
import { esDictionary } from "./dictionaries/es";
import { frDictionary } from "./dictionaries/fr";
import { deDictionary } from "./dictionaries/de";

const dictionaries: Record<Locale, Dictionary> = {
  en: enDictionary,
  ko: koDictionary,
  ja: jaDictionary,
  es: esDictionary,
  fr: frDictionary,
  de: deDictionary
};

export function getDictionary(locale: Locale): Dictionary {
  const dictionary = dictionaries[locale];
  if (!dictionary) throw new Error(`Missing dictionary for locale: ${locale}`);
  return dictionary;
}
