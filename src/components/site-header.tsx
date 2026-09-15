import Link from "next/link";
import type { Locale } from "@/src/i18n/locales";
import type { Dictionary } from "@/src/i18n/dictionaries/en";
import { localizedPath } from "@/src/lib/site-config";
import { LanguageSwitcher } from "./language-switcher";

type IconName = "tester" | "replace" | "extract" | "file-filter" | "explainer" | "guides" | "resources";

function NavIcon({ name }: { name: IconName }) {
  const common = { width: 15, height: 15, marginRight: 5, verticalAlign: "-2px" } as const;
  if (name === "tester") return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={common}><path d="M4 5h16M4 19h16M7 9l-3 3 3 3M17 9l3 3-3 3"/><path d="M10 16l4-8"/></svg>;
  if (name === "replace") return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={common}><path d="M7 7h10a4 4 0 0 1 4 4v1M17 4l3 3-3 3M17 17H7a4 4 0 0 1-4-4v-1M7 20l-3-3 3-3"/></svg>;
  if (name === "extract") return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={common}><path d="M12 3v12M7 10l5 5 5-5"/><path d="M5 20h14"/></svg>;
  if (name === "file-filter") return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={common}><path d="M4 5h16l-6 7v5l-4 2v-7z"/></svg>;
  if (name === "explainer") return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={common}><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 4 2c-1 .7-1.5 1.2-1.5 2.5M12 17h.01"/></svg>;
  if (name === "guides") return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={common}><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5zM20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5A2.5 2.5 0 0 1 20 21.5z"/></svg>;
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={common}><rect x="5" y="4" width="14" height="16" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>;
}

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
          {nav.map(([path, label]) => <Link key={path} href={localizedPath(locale, path)}><NavIcon name={path} />{label}</Link>)}
        </nav>
        <LanguageSwitcher locale={locale} dictionary={dictionary} />
      </div>
    </header>
  );
}
