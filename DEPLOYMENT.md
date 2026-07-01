# Deployment

## GitHub and Render Static Site

1. Upload the project contents to the repository root. `package.json`, `app`, `src`, `public`, and `render.yaml` must not be nested inside a second project folder.
2. In Render, create a Blueprint from the repository or create a Static Site manually.
3. Use Node 22.16.0 or later.
4. Build with `npm ci --no-audit --no-fund && npm run build`.
5. Publish `out`.
6. Set `NEXT_PUBLIC_SITE_URL` to the final canonical HTTPS origin without a trailing slash.
7. Trigger **Clear build cache & deploy** after changing any `NEXT_PUBLIC_` value.

Render static sites serve generated files through a CDN and support response-header rules in `render.yaml`. HTML uses `max-age=0, must-revalidate`; hashed `/_next/static/` assets use a one-year immutable cache.

## Custom domain and Cloudflare

Use one canonical host, either apex or `www`, and redirect the other. Enable Full or Full (strict) SSL after Render has issued its certificate. Do not apply a broad `Cache Everything` rule to HTML. A safe Cloudflare policy caches hashed assets for a long period while bypassing or revalidating HTML. After a metadata change, use **Caching → Configuration → Purge Everything**, redeploy with a cleared build cache, and inspect the HTTP response source rather than relying only on a browser hard refresh.

## DNS outline

- `www`: CNAME to the Render hostname.
- Apex: use the A/ALIAS/ANAME target shown by Render.
- Keep only the records required for the selected host.
- Wait until Render reports domain verification and certificate issuance.

## Post-deploy checks

```bash
npm run audit:deployed -- https://actual-domain.com
curl -s https://actual-domain.com/fr/tester/ | grep -E 'canonical|hreflang|google-adsense-account'
curl -i https://actual-domain.com/ads.txt
curl -i https://actual-domain.com/sitemap.xml
```

The audit checks six language homes and tester pages, representative French and German guides, status codes, content types, raw HTML metadata, `ads.txt`, `robots.txt`, and the sitemap.
