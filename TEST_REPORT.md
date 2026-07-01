# Test report

**Verification date:** 2026-07-01  
**Runtime:** Node.js 22.16.0, npm 10.9.2  
**Framework:** Next.js 16.2.9, React 19.2.7, TypeScript 5.8.3

## Final local verification

| Check | Result |
|---|---:|
| Clean dependency install (`npm ci`) | Passed — lockfile installation completed with 498 packages |
| TypeScript (`npm run typecheck`) | Passed |
| ESLint (`npm run lint`) | Passed with no reported warnings or errors |
| Vitest (`npm test`) | Passed — 16/16 tests |
| Production static build (`npm run build`) | Passed |
| Generated HTML audit | Passed — 211 indexable HTML documents |
| Localization schema | Passed — 186 keys in each of 6 languages |
| Non-English copy regression scan | Passed |
| Content length audit | Passed — 6 home pages, 42 main tool pages, 90 guides |
| Duplicate-content audit | Passed — highest measured phrase similarity 42.0% |
| Metadata and canonical audit | Passed |
| Reciprocal hreflang audit | Passed — 6 locales plus `x-default` |
| Initial `<html lang>` audit | Passed |
| Sitemap, robots, RSS and Atom audit | Passed — 14 feed files |
| JSON-LD parsing | Passed — 510 blocks |
| Internal links | Passed — 186 local targets receive links |
| AdSense ownership metadata | Passed — one tag on every indexable page |
| `ads.txt` | Passed |
| Guide regex examples | Passed — 15 patterns compiled and checked |
| Playwright scenarios | Passed — 29 passed, 1 intentionally skipped in the desktop project |

The one skipped Playwright case is the mobile-only horizontal-overflow scenario in the desktop project. The same scenario passed at both 375×812 and 390×844 viewports. The final browser scenarios were executed in split Chromium processes because the sandbox-provided system Chromium intermittently stopped responding after many consecutive launches; all individual scenarios in the suite completed successfully.

## Build output

- `out/` size during verification: approximately 41 MB
- HTML files in `out/`: 214 total, including the root recommendation page and error documents
- Localized guide pages: 90
- Canonical indexable URLs: 211

## Not yet verifiable locally

- A live-domain post-deployment audit was not run because no final deployed origin was supplied.
- Lighthouse scores were not recorded. Performance, accessibility, best-practice, and SEO values in the specification remain targets rather than guaranteed scores until the deployed site is measured.
- Search Console ownership and live AdSense crawling require the final verification value, final domain, and a completed deployment.

After deployment, run:

```bash
npm run audit:deployed -- https://your-final-domain.example
```
