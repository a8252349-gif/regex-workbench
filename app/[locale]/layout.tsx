import "../globals.css";
import "../contrast-fix.css";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { locales, isLocale } from "@/src/i18n/locales";
import { getDictionary } from "@/src/i18n/get-dictionary";
import { SiteHeader } from "@/src/components/site-header";
import { SiteFooter } from "@/src/components/site-footer";
import { AdSenseScript } from "@/src/components/adsense-script";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const dictionary = getDictionary(rawLocale);
  return (
    <html lang={rawLocale}>
      <body className={`locale-${rawLocale}`}>
        <a className="skip-link" href="#main-content">{dictionary.common.skipToContent}</a>
        <SiteHeader locale={rawLocale} dictionary={dictionary} />
        {children}
        <SiteFooter locale={rawLocale} dictionary={dictionary} />
        <AdSenseScript />
      </body>
    </html>
  );
}
