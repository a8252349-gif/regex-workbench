import fs from "node:fs";
import path from "node:path";
import { root, pass, fail, getRegistry } from "./lib.mjs";

const locales = getRegistry().locales;
function parseDictionary(locale) {
  const source = fs.readFileSync(path.join(root, `src/i18n/dictionaries/${locale}.ts`), "utf8");
  const start = source.indexOf("= ") + 2;
  const end = source.lastIndexOf(" as const");
  return JSON.parse(source.slice(start, end));
}
function flatten(value, prefix = "", result = {}) {
  for (const [key, item] of Object.entries(value)) {
    const full = prefix ? `${prefix}.${key}` : key;
    if (item && typeof item === "object") flatten(item, full, result); else result[full] = item;
  }
  return result;
}
const base = flatten(parseDictionary("en"));
let errors = 0;
for (const locale of locales) {
  const flat = flatten(parseDictionary(locale));
  const missing = Object.keys(base).filter((key) => !(key in flat));
  const extra = Object.keys(flat).filter((key) => !(key in base));
  const invalid = Object.entries(flat).filter(([key, value]) => typeof value !== "string" || !value.trim() || /\b(?:TODO|TBD|placeholder)\b/i.test(value) || value === key);
  if (missing.length || extra.length || invalid.length) {
    fail(`${locale}: missing=${missing.length}, extra=${extra.length}, invalid=${invalid.length}`); errors += 1;
  } else pass(`${locale}: ${Object.keys(flat).length} translation keys complete`);
}
if (errors) process.exitCode = 1;
