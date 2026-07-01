import fs from "node:fs";
import path from "node:path";
import { getGuides, getRegistry, root, siteUrl } from "./lib.mjs";

const url = siteUrl();
if (!url) throw new Error("NEXT_PUBLIC_SITE_URL is required before public files can be generated.");
const publicDir = path.join(root, "public");
const registry = getRegistry();
const guides = getGuides();
const locales = registry.locales;
const pagePaths = registry.pages;
const guideSlugs = registry.guides;
const lastmod = registry.lastModified;

const feedDescriptions = {
  en: "Practical JavaScript regular-expression guides",
  ko: "실무에 활용하는 JavaScript 정규표현식 가이드",
  ja: "実務で使える JavaScript 正規表現ガイド",
  es: "Guías prácticas de expresiones regulares en JavaScript",
  fr: "Guides pratiques des expressions régulières JavaScript",
  de: "Praxisnahe Leitfäden zu regulären Ausdrücken in JavaScript"
};
const xmlEscape = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;");

const localizedPath = (locale, pathname = "") => pathname ? `/${locale}/${pathname.replace(/^\/+|\/+$/g, "")}/` : `/${locale}/`;
const absolute = (pathname) => `${url}${pathname}`;

const records = [{ path: "/", alternates: Object.fromEntries(locales.map((locale) => [locale, absolute(localizedPath(locale))])) }];
for (const locale of locales) {
  for (const page of pagePaths) {
    const pathValue = localizedPath(locale, page);
    records.push({ path: pathValue, alternates: Object.fromEntries(locales.map((other) => [other, absolute(localizedPath(other, page))])) });
  }
  for (const slug of guideSlugs) {
    const guidePath = `guides/${slug}`;
    records.push({ path: localizedPath(locale, guidePath), alternates: Object.fromEntries(locales.map((other) => [other, absolute(localizedPath(other, guidePath))])) });
  }
}

const uniqueRecords = [...new Map(records.map((record) => [record.path, record])).values()];
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${uniqueRecords.map((record) => `  <url>\n    <loc>${absolute(record.path)}</loc>\n    <lastmod>${lastmod}</lastmod>\n${locales.map((locale) => `    <xhtml:link rel="alternate" hreflang="${locale}" href="${record.alternates[locale]}" />`).join("\n")}\n    <xhtml:link rel="alternate" hreflang="x-default" href="${record.alternates.en}" />\n  </url>`).join("\n")}\n</urlset>\n`;
fs.writeFileSync(path.join(publicDir, "sitemap.xml"), xml);
fs.writeFileSync(path.join(publicDir, "sitemap.txt"), uniqueRecords.map((record) => absolute(record.path)).join("\n") + "\n");
fs.writeFileSync(path.join(publicDir, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${url}/sitemap.xml\n`);
fs.writeFileSync(path.join(publicDir, "ads.txt"), "google.com, pub-9328837907414732, DIRECT, f08c47fec0942fa0\n");
fs.writeFileSync(path.join(publicDir, "site.webmanifest"), JSON.stringify({ name: "Regex Workbench", short_name: "Regex", start_url: "/en/", display: "standalone", background_color: "#f5f7fb", theme_color: "#3156d9", icons: [] }, null, 2));

function rss(locale) {
  const items = guideSlugs.map((slug) => guides[locale][slug]).slice(0, 15).map((guide) => `<item><title><![CDATA[${guide.title}]]></title><link>${absolute(localizedPath(locale, `guides/${guide.slug}`))}</link><guid>${absolute(localizedPath(locale, `guides/${guide.slug}`))}</guid><pubDate>${new Date(`${guide.lastReviewed}T00:00:00Z`).toUTCString()}</pubDate><description><![CDATA[${guide.description}]]></description></item>`).join("");
  return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Regex Workbench — ${locale}</title><link>${absolute(localizedPath(locale))}</link><description><![CDATA[${feedDescriptions[locale]}]]></description><language>${locale}</language>${items}</channel></rss>`;
}
function atom(locale) {
  const entries = guideSlugs.map((slug) => guides[locale][slug]).slice(0, 15).map((guide) => `<entry><title>${xmlEscape(guide.title)}</title><id>${absolute(localizedPath(locale, `guides/${guide.slug}`))}</id><link href="${absolute(localizedPath(locale, `guides/${guide.slug}`))}"/><updated>${guide.lastReviewed}T00:00:00Z</updated><summary>${xmlEscape(guide.description)}</summary></entry>`).join("");
  return `<?xml version="1.0" encoding="UTF-8"?><feed xmlns="http://www.w3.org/2005/Atom"><title>Regex Workbench — ${locale}</title><subtitle>${xmlEscape(feedDescriptions[locale])}</subtitle><id>${absolute(localizedPath(locale))}</id><link href="${url}/${locale}/atom.xml" rel="self"/><updated>${lastmod}T00:00:00Z</updated>${entries}</feed>`;
}
for (const locale of locales) {
  const dir = path.join(publicDir, locale);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "feed.xml"), rss(locale));
  fs.writeFileSync(path.join(dir, "atom.xml"), atom(locale));
}
fs.writeFileSync(path.join(publicDir, "feed.xml"), rss("en"));
fs.writeFileSync(path.join(publicDir, "atom.xml"), atom("en"));
console.log(`Generated sitemap with ${uniqueRecords.length} canonical URLs and feeds for ${locales.length} locales.`);
