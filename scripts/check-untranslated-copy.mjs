import { htmlFiles, loadHtml, pagePathFromFile, pass, fail } from "./lib.mjs";

const knownEnglishUi = [
  "Run test", "Run now", "No matches found", "Choose files", "Page not found", "Return home",
  "Delete all local data", "Create share link", "Replacement result", "Test cases", "Privacy Policy",
  "Terms of Service", "Cookie Policy", "Contact channel"
];
const englishSignals = new Set([
  "the", "this", "that", "these", "those", "with", "without", "from", "into", "between", "before", "after",
  "should", "must", "your", "you", "when", "where", "which", "while", "through", "against", "only", "each",
  "another", "than", "then", "does", "doesn", "will", "would", "could", "have", "has", "been", "being"
]);
const allowedTechnical = /\b(?:Regex|JavaScript|RegExp|JSON|CSV|TXT|LOG|UTF-8|URL|HTML|ReDoS|Web Worker|localStorage|matchAll|lastIndex|Unicode|Worker|Object URL)\b/gi;

function likelyEnglishSentence(value) {
  const cleaned = value.replace(allowedTechnical, " ").replace(/https?:\/\/\S+/g, " ");
  const words = cleaned.toLowerCase().match(/[a-z]+(?:'[a-z]+)?/g) ?? [];
  if (words.length < 11) return false;
  const signals = words.filter((word) => englishSignals.has(word.replace("'", "")));
  return signals.length >= 5 && new Set(signals).size >= 4;
}

const leaks = [];
for (const file of htmlFiles()) {
  const pagePath = pagePathFromFile(file);
  const locale = pagePath.split("/").filter(Boolean)[0];
  if (!locale || locale === "en" || !["ko", "ja", "es", "fr", "de"].includes(locale)) continue;
  const { $ } = loadHtml(file);
  const bodyClone = $("body").clone();
  bodyClone.find("script,style,code,pre").remove();
  const bodyText = bodyClone.text().replace(/\s+/g, " ");
  for (const phrase of knownEnglishUi) if (bodyText.includes(phrase)) leaks.push(`${pagePath}: known UI phrase “${phrase}”`);
  const candidates = [
    ...bodyText.split(/[.!?。！？]+/),
    $("meta[name='description']").attr("content") || "",
    $("meta[property='og:description']").attr("content") || "",
    ...$("[aria-label]").map((_, element) => $(element).attr("aria-label") || "").get()
  ];
  for (const candidate of candidates) {
    if (likelyEnglishSentence(candidate)) {
      leaks.push(`${pagePath}: likely English sentence “${candidate.trim().slice(0, 140)}”`);
      break;
    }
  }
  for (const script of $("script[type='application/ld+json']").toArray()) {
    const value = $(script).text();
    if (value.split(/[.!?]+/).some(likelyEnglishSentence)) {
      leaks.push(`${pagePath}: likely English sentence in JSON-LD`);
      break;
    }
  }
}

if (leaks.length) fail(`Untranslated copy detected:\n${leaks.slice(0, 30).join("\n")}`);
else pass("No known UI or likely English-sentence regressions found on non-English pages.");
