import Link from "next/link";
import type { Locale } from "@/src/i18n/locales";
import type { Dictionary } from "@/src/i18n/dictionaries/en";
import { localizedPath } from "@/src/lib/site-config";
import { LanguageSwitcher } from "./language-switcher";

export function SiteHeader({ locale, dictionary }: { locale: Locale; dictionary: Dictionary }) {
  const nav = [
    ["tester", dictionary.nav.tester],
    ["replace", dictionary.nav.replace],
    ["extract", dictionary.nav.extract],
    ["file-filter", dictionary.nav.fileFilter],
    ["explainer", dictionary.nav.explainer],
    ["guides", dictionary.nav.guides],
    ["resources", dictionary.nav.resources]
  ] as const;
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" href={localizedPath(locale)} aria-label={`${dictionary.common.brand} ${dictionary.nav.home}`}>
          <span className="brand-mark" aria-hidden="true">/.*?/</span>
          <span>{dictionary.common.brand}</span>
        </Link>
        <nav className="main-nav" aria-label={dictionary.nav.home}>
          {nav.map(([path, label]) => <Link key={path} href={localizedPath(locale, path)}>{label}</Link>)}
        </nav>
        <LanguageSwitcher locale={locale} dictionary={dictionary} />
      </div>
    </header>
  );
}
