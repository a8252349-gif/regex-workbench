import Link from "next/link";
import type { Locale } from "@/src/i18n/locales";
import type { Dictionary } from "@/src/i18n/dictionaries/en";
import type { PageContent } from "@/src/content/content";
import { localizedPath } from "@/src/lib/site-config";

export function ContentArticle({ locale, dictionary, content, children, showToolContext = true }: { locale: Locale; dictionary: Dictionary; content: PageContent; children?: React.ReactNode; showToolContext?: boolean }) {
  return (
    <main id="main-content">
      <article className="content-page">
        <header className="content-header">
          <p className="eyebrow">{dictionary.common.brand}</p>
          <h1>{content.heading}</h1>
          <p className="lead">{content.intro}</p>
          {showToolContext && <p className="callout">{dictionary.common.engine}<br />{dictionary.common.privacyNote}</p>}
        </header>
        {children}
        <div data-audit-content>
          {content.sections.map((section, index) => (
            <section className="article-section" key={`${section.heading}-${index}`}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}
              {index === 2 && <pre><code>{`const regex = /(?<level>INFO|WARN|ERROR)\\s+(?<message>.+)/g;\nconst matches = [...text.matchAll(regex)];`}</code></pre>}
            </section>
          ))}
          <section className="article-section">
            <h2>{dictionary.nav.faq}</h2>
            <div className="faq-list">
              {content.faq.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}
            </div>
          </section>
          <section className="article-section">
            <h2>{dictionary.common.relatedTools}</h2>
            <div className="button-row">
              <Link className="button" href={localizedPath(locale, "tester")}>{dictionary.nav.tester}</Link>
              <Link className="button" href={localizedPath(locale, "replace")}>{dictionary.nav.replace}</Link>
              <Link className="button" href={localizedPath(locale, "extract")}>{dictionary.nav.extract}</Link>
              <Link className="button" href={localizedPath(locale, "guides")}>{dictionary.nav.guides}</Link>
            </div>
          </section>
        </div>
      </article>
    </main>
  );
}
