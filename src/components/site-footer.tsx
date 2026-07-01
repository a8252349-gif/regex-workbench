import Link from "next/link";
import type { Locale } from "@/src/i18n/locales";
import type { Dictionary } from "@/src/i18n/dictionaries/en";
import { localizedPath, siteConfig } from "@/src/lib/site-config";
import { PrivacySettingsButton } from "./privacy-settings-button";

export function SiteFooter({ locale, dictionary }: { locale: Locale; dictionary: Dictionary }) {
  const policyLinks = [
    ["privacy", dictionary.footer.privacy], ["terms", dictionary.footer.terms],
    ["cookies", dictionary.footer.cookies], ["accessibility", dictionary.footer.accessibility],
    ["editorial-policy", dictionary.footer.editorial], ["security", dictionary.footer.security],
    ["methodology", dictionary.footer.methodology], ["contact", dictionary.footer.contact]
  ] as const;
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <section>
          <h2>{dictionary.common.brand}</h2>
          <p>{dictionary.common.tagline}</p>
          <p className="build-version">{dictionary.common.version}: {siteConfig.buildVersion}</p>
        </section>
        <section>
          <h2>{dictionary.footer.tools}</h2>
          <Link href={localizedPath(locale, "tester")}>{dictionary.nav.tester}</Link>
          <Link href={localizedPath(locale, "replace")}>{dictionary.nav.replace}</Link>
          <Link href={localizedPath(locale, "extract")}>{dictionary.nav.extract}</Link>
          <Link href={localizedPath(locale, "file-filter")}>{dictionary.nav.fileFilter}</Link>
        </section>
        <section>
          <h2>{dictionary.footer.policies}</h2>
          {policyLinks.map(([path, label]) => <Link key={path} href={localizedPath(locale, path)}>{label}</Link>)}
          <PrivacySettingsButton label={dictionary.footer.settings} />
        </section>
      </div>
      <div id="privacy-settings-panel" popover="auto" className="privacy-popover">
        <p>{dictionary.common.privacyNote}</p>
        <Link href={localizedPath(locale, "cookies")}>{dictionary.footer.cookies}</Link>
      </div>
      <p className="footer-bottom">© {new Date().getUTCFullYear()} {dictionary.footer.copyright}</p>
    </footer>
  );
}
