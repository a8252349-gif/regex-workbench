import type { Metadata } from "next";
import { locales, openGraphLocales, type Locale } from "@/src/i18n/locales";
import { absoluteUrl, localizedPath, siteConfig } from "@/src/lib/site-config";

interface MetadataInput {
  locale: Locale;
  pathname?: string;
  title: string;
  description: string;
  keywords?: string[];
  type?: "website" | "article";
  image?: string;
  index?: boolean;
  publishedDate?: string;
  modifiedDate?: string;
}

export function buildLocalizedMetadata(input: MetadataInput): Metadata {
  const pathname = input.pathname || "";
  const canonicalPath = localizedPath(input.locale, pathname);
  const languageAlternates = Object.fromEntries(
    locales.map((locale) => [locale, absoluteUrl(localizedPath(locale, pathname))])
  );
  languageAlternates["x-default"] = absoluteUrl(localizedPath("en", pathname));

  const alternateLocales = locales
    .filter((locale) => locale !== input.locale)
    .map((locale) => openGraphLocales[locale]);

  const image = input.image || "/og.png";
  const metadata: Metadata = {
    metadataBase: new URL(siteConfig.url),
    title: input.title,
    description: input.description,
    keywords: input.keywords,
    alternates: {
      canonical: absoluteUrl(canonicalPath),
      languages: languageAlternates
    },
    robots: input.index === false ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: input.type || "website",
      title: input.title,
      description: input.description,
      url: absoluteUrl(canonicalPath),
      siteName: siteConfig.name,
      locale: openGraphLocales[input.locale],
      alternateLocale: alternateLocales,
      images: [{ url: image, width: 1200, height: 630, alt: input.title }],
      ...(input.type === "article" && input.publishedDate
        ? { publishedTime: input.publishedDate, modifiedTime: input.modifiedDate || input.publishedDate }
        : {})
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [image]
    },
    other: {
      "google-adsense-account": siteConfig.adsenseClient
    }
  };

  if (siteConfig.googleSiteVerification) {
    metadata.verification = { google: siteConfig.googleSiteVerification };
  }

  return metadata;
}
