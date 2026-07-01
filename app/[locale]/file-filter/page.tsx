import type { Metadata } from "next";
import { ContentArticle } from "@/src/components/content-article";
import { JsonLd } from "@/src/components/json-ld";
import { FileFilterClient } from "@/src/components/file-filter-client";
import { getPageContent } from "@/src/content/content";
import { getDictionary } from "@/src/i18n/get-dictionary";
import { resolveLocale } from "@/src/lib/locale";
import { metadataForPage } from "@/src/lib/seo/page-metadata";
import { toolJsonLd } from "@/src/lib/seo/json-ld";

export function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> { return metadataForPage(params, "file-filter", "file-filter"); }
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
 const locale=await resolveLocale(params); const dictionary=getDictionary(locale); const content=getPageContent(locale,"file-filter");
 return <><JsonLd data={toolJsonLd(locale,"file-filter",content)} /><ContentArticle locale={locale} dictionary={dictionary} content={content}><FileFilterClient dictionary={dictionary} /></ContentArticle></>;
}
