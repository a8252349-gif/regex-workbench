import Link from "next/link";
import type { Locale } from "@/src/i18n/locales";
import type { Dictionary } from "@/src/i18n/dictionaries/en";
import { getGuideContent, type GuideContent } from "@/src/content/content";
import { localizedPath } from "@/src/lib/site-config";
import { GuideVisual } from "./guide-visual";

export function GuideArticle({ locale, dictionary, guide }: { locale: Locale; dictionary: Dictionary; guide: GuideContent }) {
  return (
    <main id="main-content">
      <article className="content-page" data-guide-slug={guide.slug}>
        <header className="content-header">
          <p className="eyebrow">{dictionary.nav.guides}</p>
          <h1>{guide.title}</h1>
          <p className="lead">{guide.intro}</p>
          <p>{dictionary.common.lastReviewed}: <time dateTime={guide.lastReviewed}>{guide.lastReviewed}</time></p>
        </header>
        <GuideVisual slug={guide.slug} title={guide.title} description={guide.imageAlt} />
        <div className="callout"><strong>{dictionary.common.engine}</strong><br />{dictionary.common.privacyNote}</div>
        <section className="article-section">
          <h2>{guide.sections[1]?.heading}</h2>
          <pre><code>{`const regex = new RegExp(${JSON.stringify(guide.pattern)}, "gu");\nconst input = ${JSON.stringify(guide.input)};\nconsole.log(regex.exec(input)); // ${guide.output}`}</code></pre>
        </section>
        <div data-audit-content>
          {guide.sections.map((section, index) => (
            <section className="article-section" key={`${section.heading}-${index}`}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}
              {index === 3 && <pre><code>{`// Deliberately risky or overbroad example\nconst weakPattern = /${guide.invalidPattern}/;`}</code></pre>}
              {index === 10 && <div className="table-wrap"><table className="data-table"><thead><tr>{guide.table.headers.map((header) => <th scope="col" key={header}>{header}</th>)}</tr></thead><tbody>{guide.table.rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table></div>}
              {index === 11 && <ul className="checklist">{guide.checklist.map((item) => <li key={item}>✓ {item}</li>)}</ul>}
            </section>
          ))}
          <section className="article-section">
            <h2>{dictionary.nav.faq}</h2>
            <div className="faq-list">{guide.faq.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div>
          </section>
          <section className="article-section">
            <h2>{dictionary.common.relatedGuides}</h2>
            <div className="guide-list">
              {guide.related.map((slug) => { const related = getGuideContent(locale, slug); return <Link className="card guide-card" href={localizedPath(locale, `guides/${slug}`)} key={slug}><h3>{related.title}</h3><p>{related.description}</p></Link>; })}
            </div>
          </section>
          <section className="article-section callout">
            <h2>{dictionary.common.openTool}</h2>
            <p>{dictionary.common.tagline}</p>
            <Link className="button button-primary" href={`${localizedPath(locale, "tester")}?pattern=${encodeURIComponent(guide.pattern)}&text=${encodeURIComponent(guide.input)}`}>{dictionary.common.openTool}</Link>
          </section>
        </div>
      </article>
    </main>
  );
}
