# Translation guide

The URL locale is the only authority for rendered language. Local storage may remember a selection, but it never overwrites `/ko/`, `/fr/`, or another explicit locale URL.

Dictionaries live in `src/i18n/dictionaries/`. English defines the TypeScript schema; every other dictionary uses `satisfies Dictionary`. Production does not perform an English fallback. Add a key to English and every other locale must add the same key before type checking and the i18n audit can pass.

Technical tokens that may remain untranslated include Regex, JavaScript, RegExp, JSON, CSV, TXT, LOG, UTF-8, URL, HTML, ReDoS, Web Worker, and flag letters. Buttons, labels, errors, empty states, tooltips, ARIA labels, metadata, FAQs, policy copy, and JSON-LD user-visible strings must be localized.

To add a language, update `src/i18n/locales.ts`, all dictionary/content registries, page and guide generated content, Open Graph locale mapping, sitemap generation, translation checks, and Playwright expectations. Do not add a language that has empty guides or English body copy.
