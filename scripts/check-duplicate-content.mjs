import { htmlFiles, loadHtml, pagePathFromFile, pass, fail } from "./lib.mjs";

function shingles(text, locale) {
  const normalized = text.toLowerCase().replace(/\s+/g, " ").trim();
  if (locale === "ko" || locale === "ja") {
    const compact = normalized.replace(/\s+/g, "");
    const result = new Set();
    for (let i = 0; i <= compact.length - 18; i += 1) result.add(compact.slice(i, i + 18));
    return result;
  }
  const tokens = normalized.match(/[\p{L}\p{N}_'-]+/gu) ?? [];
  const result = new Set();
  for (let i = 0; i <= tokens.length - 5; i += 1) result.add(tokens.slice(i, i + 5).join(" "));
  return result;
}

function jaccard(a, b) {
  if (!a.size || !b.size) return 0;
  let shared = 0;
  for (const value of a) if (b.has(value)) shared += 1;
  return shared / (a.size + b.size - shared);
}

const pages = [];
for (const file of htmlFiles()) {
  const page = pagePathFromFile(file);
  if (!/^\/(en|ko|ja|es|fr|de)\//.test(page)) continue;
  const { $ } = loadHtml(file);
  const paragraphs = $("[data-audit-content] p")
    .map((_, el) => $(el).text().replace(/\s+/g, " ").trim())
    .get()
    .filter((paragraph) => paragraph.length > 140);
  const locale = page.split("/")[1];
  const auditText = $("[data-audit-content]").text().replace(/\s+/g, " ").trim();
  pages.push({ page, locale, paragraphs: new Set(paragraphs), grams: shingles(auditText, locale) });
}

const errors = [];
let highestPageSimilarity = { ratio: 0, pair: "none" };
for (let i = 0; i < pages.length; i += 1) {
  for (let j = i + 1; j < pages.length; j += 1) {
    const left = pages[i];
    const right = pages[j];
    if (left.locale !== right.locale) continue;
    if (left.paragraphs.size && right.paragraphs.size) {
      const shared = [...left.paragraphs].filter((paragraph) => right.paragraphs.has(paragraph)).length;
      const ratio = shared / Math.min(left.paragraphs.size, right.paragraphs.size);
      if (ratio > 0.45) errors.push(`${left.page} <> ${right.page}: exact paragraph overlap ${(ratio * 100).toFixed(0)}%`);
    }
    const ratio = jaccard(left.grams, right.grams);
    if (ratio > highestPageSimilarity.ratio) highestPageSimilarity = { ratio, pair: `${left.page} <> ${right.page}` };
    if (ratio > 0.52) errors.push(`${left.page} <> ${right.page}: repeated phrase similarity ${(ratio * 100).toFixed(1)}%`);
  }
}

if (errors.length) {
  fail(`Duplicate content audit failed (${errors.length}):\n${errors.slice(0, 30).join("\n")}`);
} else {
  pass(`Duplicate audit passed. Highest localized page phrase similarity: ${(highestPageSimilarity.ratio * 100).toFixed(1)}% (${highestPageSimilarity.pair}).`);
}
