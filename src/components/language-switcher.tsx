"use client";

import { usePathname, useRouter } from "next/navigation";
import { localeNames, locales, type Locale } from "@/src/i18n/locales";
import type { Dictionary } from "@/src/i18n/dictionaries/en";

export function LanguageSwitcher({ locale, dictionary }: { locale: Locale; dictionary: Dictionary }) {
  const pathname = usePathname();
  const router = useRouter();

  function switchLocale(nextLocale: Locale) {
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length && (locales as readonly string[]).includes(parts[0])) parts[0] = nextLocale;
    else parts.unshift(nextLocale);
    const destination = `/${parts.join("/")}/`;
    localStorage.setItem("regex-workbench-locale", nextLocale);
    router.push(destination);
  }

  return (
    <label className="language-select">
      <span className="sr-only">{dictionary.language.label}</span>
      <select
        aria-label={dictionary.language.label}
        value={locale}
        onChange={(event) => switchLocale(event.target.value as Locale)}
      >
        {locales.map((value) => (
          <option value={value} key={value}>{localeNames[value]}</option>
        ))}
      </select>
    </label>
  );
}
