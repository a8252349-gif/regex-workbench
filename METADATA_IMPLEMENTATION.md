# Metadata implementation

`src/lib/seo/build-localized-metadata.ts` creates metadata in Server Components. Every routable page exports `generateMetadata`; no page changes title or description from `useEffect`.

- `metadataBase`: final `NEXT_PUBLIC_SITE_URL`
- Canonical: absolute self URL with a trailing slash
- Share queries: excluded from canonical because metadata is generated from the route path
- Alternates: `en`, `ko`, `ja`, `es`, `fr`, `de`, and `x-default`
- Open Graph: localized title, description, URL, locale, and alternate locales
- Twitter: summary large image card
- Search Console: emitted only when `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` is non-empty
- AdSense ownership: emitted independently of ad-script activation

`check-generated-html.mjs` parses `out/` rather than inspecting a hydrated browser DOM. `postdeploy-audit.mjs` fetches the deployed HTTP source and repeats the important checks. If a CDN serves old HTML, purge Cloudflare, clear Render's build cache, redeploy, and fetch source again.
