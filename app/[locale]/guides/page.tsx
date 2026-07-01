import type { Metadata } from "next";
import Link from "next/link";
import { ContentArticle } from "@/src/components/content-article";
import { JsonLd } from "@/src/components/json-ld";
import { getAllGuides, getPageContent } from "@/src/content/content";
import { getDictionary } from "@/src/i18n/get-dictionary";
import { resolveLocale } from "@/src/lib/locale";
import { localizedPath } from "@/src/lib/site-config";
import { metadataForPage } from "@/src/lib/seo/page-metadata";
import { breadcrumbJsonLd } from "@/src/lib/seo/json-ld";

export function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  return metadataForPage(params, "guides", "guides");
}

export default async function GuidesPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  const dictionary = getDictionary(locale);
  const content = getPageContent(locale, "guides");
  const guides = getAllGuides(locale);
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(locale, [{ name: dictionary.common.brand, path: "" }, { name: content.title, path: "guides" }])} />
      <ContentArticle locale={locale} dictionary={dictionary} content={content}>
        <section className="guide-list" aria-label={dictionary.nav.guides}>
          {guides.map((guide, index) => (
            <Link className="card guide-card" href={localizedPath(locale, `guides/${guide.slug}`)} key={guide.slug}>
              <p className="eyebrow">{String(index + 1).padStart(2, "0")}</p>
              <h2>{guide.title}</h2>
              <p>{guide.description}</p>
            </Link>
          ))}
        </section>
      </ContentArticle>
    </>
  );
}
