# Cache and deployment behavior

Next.js static export creates an HTML file for every route. Public environment variables are embedded during the build, so changing a Render environment variable without a new deployment cannot alter existing HTML.

Cache policy in `render.yaml`:

- HTML and unmatched paths: `public, max-age=0, must-revalidate`
- `/_next/static/*`: one year and immutable because files are content-hashed
- `ads.txt`: five minutes
- `robots.txt` and `sitemap.xml`: fifteen minutes

No Service Worker or offline PWA cache is installed. Do not create a Cloudflare `Cache Everything` rule for HTML. When stale metadata appears, clear Render's build cache, redeploy, purge Cloudflare, and inspect raw HTTP source with `curl` or `npm run audit:deployed`.
