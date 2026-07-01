import { ContentArticle } from "./content-article";
import { ContactPanel } from "./contact-panel";
import { JsonLd } from "./json-ld";
import { getPageContent, type PageKey } from "@/src/content/content";
import { getDictionary } from "@/src/i18n/get-dictionary";
import type { Locale } from "@/src/i18n/locales";
import { breadcrumbJsonLd, faqJsonLd } from "@/src/lib/seo/json-ld";

export function StaticInfoPage({ locale, pageKey, path }: { locale: Locale; pageKey: PageKey; path: string }) {
  const dictionary = getDictionary(locale);
  const content = getPageContent(locale, pageKey);
  return (
    <>
      <JsonLd data={[breadcrumbJsonLd(locale, [{ name: dictionary.common.brand, path: "" }, { name: content.title, path }]), faqJsonLd(content.faq)]} />
      <ContentArticle locale={locale} dictionary={dictionary} content={content} showToolContext={false}>{pageKey === "contact" ? <ContactPanel dictionary={dictionary} /> : null}</ContentArticle>
    </>
  );
}
