import type { Metadata } from "next";
import { ContentArticle } from "@/src/components/content-article";
import { JsonLd } from "@/src/components/json-ld";
import { WorkbenchClient } from "@/src/components/workbench-client";
import { getPageContent } from "@/src/content/content";
import { getDictionary } from "@/src/i18n/get-dictionary";
import { resolveLocale } from "@/src/lib/locale";
import { metadataForPage } from "@/src/lib/seo/page-metadata";
import { toolJsonLd } from "@/src/lib/seo/json-ld";

export function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  return metadataForPage(params, "extract", "extract");
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  const dictionary = getDictionary(locale);
  const content = getPageContent(locale, "extract");
  return <><JsonLd data={toolJsonLd(locale, "extract", content)} /><ContentArticle locale={locale} dictionary={dictionary} content={content}><WorkbenchClient locale={locale} dictionary={dictionary} mode="extract" /></ContentArticle></>;
}
