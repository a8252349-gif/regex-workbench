import type { Metadata } from "next";
import Link from "next/link";
import { CompactTester } from "@/src/components/compact-tester";
import { JsonLd } from "@/src/components/json-ld";
import { getAllGuides, getPageContent } from "@/src/content/content";
import { getDictionary } from "@/src/i18n/get-dictionary";
import { resolveLocale } from "@/src/lib/locale";
import { localizedPath } from "@/src/lib/site-config";
import { buildLocalizedMetadata } from "@/src/lib/seo/build-localized-metadata";
import { websiteJsonLd } from "@/src/lib/seo/json-ld";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const content = getPageContent(locale, "home");
  return buildLocalizedMetadata({ locale, title: content.metaTitle, description: content.description, keywords: content.keywords });
}

export default async function LocaleHome({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  const dictionary = getDictionary(locale);
  const content = getPageContent(locale, "home");
  const guides = getAllGuides(locale).slice(0, 6);
  return (
    <main id="main-content">
      <JsonLd data={websiteJsonLd(locale, content)} />
      <section className="hero">
        <div><p className="eyebrow">JavaScript RegExp</p><h1>{content.heading}</h1><p className="lead">{dictionary.common.tagline}</p><div className="button-row"><Link className="button button-primary" href={localizedPath(locale, "tester")}>{dictionary.common.openTool}</Link><Link className="button" href={localizedPath(locale, "guides")}>{dictionary.nav.guides}</Link></div></div>
        <div className="hero-card"><p><strong>{dictionary.common.engine}</strong></p><pre className="hero-code"><code>{`/(?<level>INFO|WARN|ERROR)\\s+(?<message>.+)/g`}</code></pre><p>{dictionary.common.privacyNote}</p></div>
      </section>
      <CompactTester dictionary={dictionary} />
      <article className="content-page" data-audit-content>
        {content.sections.map((section, index) => <section className="article-section" key={`${section.heading}-${index}`}><h2>{section.heading}</h2>{section.paragraphs.map((paragraph, pIndex) => <p key={pIndex}>{paragraph}</p>)}</section>)}
        <section className="article-section"><h2>{dictionary.common.relatedGuides}</h2><div className="guide-list">{guides.map((guide) => <Link className="card guide-card" href={localizedPath(locale, `guides/${guide.slug}`)} key={guide.slug}><h3>{guide.title}</h3><p>{guide.description}</p></Link>)}</div></section>
        <section className="article-section"><h2>{dictionary.nav.faq}</h2><div className="faq-list">{content.faq.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div></section>
      </article>
    </main>
  );
}
