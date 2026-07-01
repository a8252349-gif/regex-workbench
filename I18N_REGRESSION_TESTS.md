# Internationalization regression tests

Previous failure modes included a fixed English root language, dictionaries returning English for every locale, local storage overriding the URL, missing French and German metadata, and language switching returning to the home page.

The current architecture prevents those regressions as follows:

- `app/[locale]/layout.tsx` is a real root layout and emits `<html lang={locale}>` in the initial HTML.
- `/` has a separate root layout and offers a recommendation rather than a forced redirect.
- `src/i18n/locales.ts` is the single locale registry.
- Dictionaries have an identical compile-time schema and no production fallback.
- The language selector replaces only the first locale segment, preserving the current path and guide slug.
- `scripts/check-html-lang.mjs` compares every generated route with its initial language.
- `scripts/check-untranslated-copy.mjs` checks known English UI regressions in non-English output.
- Playwright verifies all six tester routes, localized Run buttons, same-page language switching, reload behavior, and URL priority over local storage.
- French and German are included in the same route, content, metadata, sitemap, and test loops as the other four languages.
