import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideArticle } from "@/src/components/guide-article";
import { JsonLd } from "@/src/components/json-ld";
import { getGuideContent, guideSlugs } from "@/src/content/content";
import { getDictionary } from "@/src/i18n/get-dictionary";
import { isLocale, locales } from "@/src/i18n/locales";
import { buildLocalizedMetadata } from "@/src/lib/seo/build-localized-metadata";
import { guideJsonLd } from "@/src/lib/seo/json-ld";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => guideSlugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale) || !guideSlugs.includes(slug)) return {};
  const guide = getGuideContent(rawLocale, slug);
  return buildLocalizedMetadata({
    locale: rawLocale,
    pathname: `guides/${slug}`,
    title: guide.metaTitle,
    description: guide.description,
    type: "article",
    publishedDate: guide.lastReviewed,
    modifiedDate: guide.lastReviewed,
    keywords: [guide.title, "JavaScript", "Regex", "RegExp"]
  });
}

export default async function GuidePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale) || !guideSlugs.includes(slug)) notFound();
  const dictionary = getDictionary(rawLocale);
  const guide = getGuideContent(rawLocale, slug);
  return <><JsonLd data={guideJsonLd(rawLocale, guide, guide.faq)} /><GuideArticle locale={rawLocale} dictionary={dictionary} guide={guide} /></>;
}
