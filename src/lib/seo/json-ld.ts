import { absoluteUrl, localizedPath, siteConfig } from "@/src/lib/site-config";
import type { Locale } from "@/src/i18n/locales";
import type { FaqItem, GuideContent, PageContent } from "@/src/content/content";

const applicationLabels: Record<Locale, { operatingSystem: string; browserRequirements: string }> = {
  en: { operatingSystem: "A modern web browser", browserRequirements: "JavaScript must be enabled" },
  ko: { operatingSystem: "최신 웹 브라우저", browserRequirements: "JavaScript를 사용할 수 있어야 합니다" },
  ja: { operatingSystem: "最新のウェブブラウザー", browserRequirements: "JavaScript を有効にする必要があります" },
  es: { operatingSystem: "Un navegador web moderno", browserRequirements: "JavaScript debe estar habilitado" },
  fr: { operatingSystem: "Un navigateur web moderne", browserRequirements: "JavaScript doit être activé" },
  de: { operatingSystem: "Ein moderner Webbrowser", browserRequirements: "JavaScript muss aktiviert sein" }
};

export function websiteJsonLd(locale: Locale, content: PageContent) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: siteConfig.name,
      url: absoluteUrl(localizedPath(locale)),
      inLanguage: locale,
      description: content.description
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url
    },
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: content.title,
      applicationCategory: "DeveloperApplication",
      operatingSystem: applicationLabels[locale].operatingSystem,
      browserRequirements: applicationLabels[locale].browserRequirements,
      url: absoluteUrl(localizedPath(locale)),
      inLanguage: locale,
      description: content.description,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }
    }
  ];
}

export function toolJsonLd(locale: Locale, path: string, content: PageContent) {
  return [
    {
      "@context": "https://schema.org",
      "@type": ["WebApplication", "SoftwareApplication"],
      name: content.title,
      applicationCategory: "DeveloperApplication",
      operatingSystem: applicationLabels[locale].operatingSystem,
      browserRequirements: applicationLabels[locale].browserRequirements,
      url: absoluteUrl(localizedPath(locale, path)),
      inLanguage: locale,
      description: content.description,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }
    },
    breadcrumbJsonLd(locale, [{ name: siteConfig.name, path: "" }, { name: content.title, path }])
  ];
}

export function guideJsonLd(locale: Locale, guide: GuideContent, faq: FaqItem[]) {
  const path = `guides/${guide.slug}`;
  const guideLabels: Record<Locale, string> = { en: "Guides", ko: "가이드", ja: "ガイド", es: "Guías", fr: "Guides", de: "Anleitungen" };
  return [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: guide.title,
      description: guide.description,
      datePublished: guide.lastReviewed,
      dateModified: guide.lastReviewed,
      inLanguage: locale,
      mainEntityOfPage: absoluteUrl(localizedPath(locale, path)),
      author: { "@type": "Organization", name: siteConfig.name },
      publisher: { "@type": "Organization", name: siteConfig.name }
    },
    breadcrumbJsonLd(locale, [
      { name: siteConfig.name, path: "" },
      { name: guideLabels[locale], path: "guides" },
      { name: guide.title, path }
    ]),
    faqJsonLd(faq)
  ];
}

export function faqJsonLd(faq: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer }
    }))
  };
}

export function breadcrumbJsonLd(locale: Locale, items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(localizedPath(locale, item.path))
    }))
  };
}
