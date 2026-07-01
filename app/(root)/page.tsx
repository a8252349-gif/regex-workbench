import type { Metadata } from "next";
import Link from "next/link";
import { LanguageSuggestion } from "@/src/components/language-suggestion";
import { locales, localeNames } from "@/src/i18n/locales";
import { absoluteUrl, localizedPath, siteConfig } from "@/src/lib/site-config";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: "Regex Workbench — Choose your language",
  description: "Open Regex Workbench in English, 한국어, 日本語, Español, Français, or Deutsch.",
  alternates: {
    canonical: absoluteUrl("/"),
    languages: {
      en: absoluteUrl(localizedPath("en")), ko: absoluteUrl(localizedPath("ko")), ja: absoluteUrl(localizedPath("ja")),
      es: absoluteUrl(localizedPath("es")), fr: absoluteUrl(localizedPath("fr")), de: absoluteUrl(localizedPath("de")),
      "x-default": absoluteUrl(localizedPath("en"))
    }
  },
  openGraph: { title: "Regex Workbench", description: "Browser-based JavaScript regex tools in six languages.", url: absoluteUrl("/"), siteName: "Regex Workbench", type: "website", images: ["/og.png"] },
  twitter: { card: "summary_large_image", title: "Regex Workbench", description: "Browser-based JavaScript regex tools in six languages.", images: ["/og.png"] },
  other: { "google-adsense-account": siteConfig.adsenseClient },
  ...(siteConfig.googleSiteVerification ? { verification: { google: siteConfig.googleSiteVerification } } : {})
};

export default function RootPage() {
  return (
    <>
      <LanguageSuggestion />
      <main id="main-content">
        <section className="hero">
          <div>
            <p className="eyebrow">JavaScript RegExp · Local browser processing</p>
            <h1>Regex Workbench</h1>
            <p className="lead">Test, explain, replace, extract, and filter local files with JavaScript regular expressions. Choose a language to continue.</p>
          </div>
          <div className="hero-card"><pre className="hero-code"><code>{`/(?<level>INFO|WARN|ERROR)\\s+(?<message>.+)/g`}</code></pre><p>No forced redirect. Your URL determines the language.</p></div>
        </section>
        <section className="article-section">
          <h2>Choose your language</h2>
          <div className="content-grid">{locales.map((locale) => <Link className="card guide-card" href={localizedPath(locale)} key={locale}><h3 lang={locale}>{localeNames[locale]}</h3><p>{localizedPath(locale)}</p></Link>)}</div>
        </section>
      </main>
    </>
  );
}
