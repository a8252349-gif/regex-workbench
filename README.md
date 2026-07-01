# Regex Workbench

Regex Workbench is a six-language, browser-based JavaScript regular-expression workbench. It tests patterns, highlights matches, exposes capture groups, previews replacements, extracts values, filters local text files, explains tokens, and warns about potential backtracking structures. Patterns, test strings, and uploaded files are processed locally; there is no regex execution API or account database.

## Supported languages

- English (`/en/`)
- 한국어 (`/ko/`)
- 日本語 (`/ja/`)
- Español (`/es/`)
- Français (`/fr/`)
- Deutsch (`/de/`)

## Local setup

```bash
npm ci
npm run dev
```

Copy `.env.example` to `.env.local` for local production builds, or register the same values in Render. `NEXT_PUBLIC_SITE_URL` is mandatory for a production build and must use the final HTTPS origin. Public `NEXT_PUBLIC_` values are embedded at build time, so rebuild after every change.

## Validation and production build

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

The build generates `out/`, then audits generated HTML, localization, content length, exact-paragraph and five-word phrase similarity, metadata, hreflang, HTML language, sitemap, structured data, links, AdSense ownership metadata, `ads.txt`, and regex examples.

## Render

- Build command: `npm ci --no-audit --no-fund && npm run build`
- Publish directory: `out`
- Blueprint: `render.yaml`

After deployment:

```bash
npm run audit:deployed -- https://your-domain.example
```

## Important limits

The execution engine is the current browser's JavaScript `RegExp`. The site does not execute PCRE, Python, Java, or .NET regex engines. Static risk warnings and Worker timeouts reduce impact but cannot prove that a pattern is safe for every possible input.
