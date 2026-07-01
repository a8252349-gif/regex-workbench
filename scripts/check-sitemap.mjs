import fs from "node:fs";
import path from "node:path";
import { load } from "cheerio";
import { getRegistry, outDir, pass, fail, siteUrl } from "./lib.mjs";

const errors = [];
const registry = getRegistry();
const expected = 1 + registry.locales.length * (registry.pages.length + registry.guides.length);
const sitemapFile = path.join(outDir, "sitemap.xml");
let locs = [];

if (!fs.existsSync(sitemapFile)) {
  errors.push("sitemap.xml missing");
} else {
  const xml = fs.readFileSync(sitemapFile, "utf8");
  const $ = load(xml, { xmlMode: true });
  locs = $("url > loc").map((_, element) => $(element).text()).get();
  if (locs.length !== expected) errors.push(`expected ${expected} URLs, found ${locs.length}`);
  if (new Set(locs).size !== locs.length) errors.push("duplicate sitemap URLs");
  for (const loc of locs) {
    if (!loc.startsWith(siteUrl())) errors.push(`wrong host ${loc}`);
    const parsed = new URL(loc);
    const target = parsed.pathname === "/" ? path.join(outDir, "index.html") : path.join(outDir, parsed.pathname, "index.html");
    if (!fs.existsSync(target)) errors.push(`target missing ${parsed.pathname}`);
    if (parsed.search) errors.push(`query URL found ${loc}`);
  }
  if ($("url > lastmod").toArray().some((element) => !/^\d{4}-\d{2}-\d{2}$/.test($(element).text()))) errors.push("invalid lastmod");
  for (const element of $("url").toArray()) {
    const alternates = $(element).find('xhtml\\:link[rel="alternate"]');
    if (alternates.length !== 7) errors.push(`sitemap hreflang count ${alternates.length}`);
  }
}

const textFile = path.join(outDir, "sitemap.txt");
if (!fs.existsSync(textFile)) {
  errors.push("sitemap.txt missing");
} else {
  const textUrls = fs.readFileSync(textFile, "utf8").split(/\r?\n/).filter(Boolean);
  if (textUrls.length !== expected) errors.push(`sitemap.txt expected ${expected} URLs, found ${textUrls.length}`);
  if (locs.length && textUrls.some((value, index) => value !== locs[index])) errors.push("sitemap.txt differs from sitemap.xml order or values");
}

const robotsFile = path.join(outDir, "robots.txt");
if (!fs.existsSync(robotsFile)) {
  errors.push("robots.txt missing");
} else {
  const robots = fs.readFileSync(robotsFile, "utf8");
  if (!/User-agent:\s*\*/i.test(robots) || !/Allow:\s*\//i.test(robots)) errors.push("robots.txt does not allow crawling");
  if (!robots.includes(`Sitemap: ${siteUrl()}/sitemap.xml`)) errors.push("robots.txt sitemap URL mismatch");
  if (/Disallow:\s*\/(?:_next|en|ko|ja|es|fr|de|ads\.txt)/i.test(robots)) errors.push("robots.txt blocks an indexable resource");
}

const feedTargets = [
  [path.join(outDir, "feed.xml"), "rss", 15],
  [path.join(outDir, "atom.xml"), "feed", 15],
  ...registry.locales.flatMap((locale) => [
    [path.join(outDir, locale, "feed.xml"), "rss", 15],
    [path.join(outDir, locale, "atom.xml"), "feed", 15]
  ])
];
for (const [file, rootName, expectedEntries] of feedTargets) {
  if (!fs.existsSync(file)) {
    errors.push(`feed missing ${path.relative(outDir, file)}`);
    continue;
  }
  const xml = fs.readFileSync(file, "utf8");
  const $ = load(xml, { xmlMode: true });
  if ($(rootName).length !== 1) errors.push(`invalid feed root ${path.relative(outDir, file)}`);
  const count = rootName === "rss" ? $("item").length : $("entry").length;
  if (count !== expectedEntries) errors.push(`${path.relative(outDir, file)} expected ${expectedEntries} entries, found ${count}`);
  if (/atom\.xml\/$/.test(xml)) errors.push(`${path.relative(outDir, file)} contains an invalid trailing slash self URL`);
}

if (errors.length) fail(`Sitemap and feed audit failed (${errors.length}):\n${errors.slice(0, 40).join("\n")}`);
else pass(`sitemap.xml, sitemap.txt, robots.txt, and ${feedTargets.length} RSS/Atom feeds are complete.`);
