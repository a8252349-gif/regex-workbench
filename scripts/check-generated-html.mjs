import { env, htmlFiles, loadHtml, pagePathFromFile, pass, fail, siteUrl } from "./lib.mjs";

const expectedAdsense = env("NEXT_PUBLIC_ADSENSE_CLIENT", "ca-pub-9328837907414732");
const verification = env("NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION");
let checked = 0; const errors = [];
for (const file of htmlFiles()) {
  const page = pagePathFromFile(file);
  if (page === "/404/" || page === "/_not-found/") continue;
  const { $, source } = loadHtml(file);
  const title = $("head title");
  const description = $('meta[name="description"]');
  const canonical = $('link[rel="canonical"]');
  const alternates = $('link[rel="alternate"][hreflang]');
  const localized = /^\/(en|ko|ja|es|fr|de)\//.test(page);
  if (title.length !== 1) errors.push(`${page}: title count ${title.length}`);
  if (description.length !== 1) errors.push(`${page}: description count ${description.length}`);
  if (canonical.length !== 1) errors.push(`${page}: canonical count ${canonical.length}`);
  if (alternates.length !== 7) errors.push(`${page}: hreflang count ${alternates.length}`);
  if (!$('meta[property="og:title"]').attr("content")) errors.push(`${page}: missing og:title`);
  if (!$('meta[property="og:description"]').attr("content")) errors.push(`${page}: missing og:description`);
  if (!$('meta[property="og:url"]').attr("content")) errors.push(`${page}: missing og:url`);
  if (!$('meta[name="twitter:card"]').attr("content")) errors.push(`${page}: missing twitter card`);
  if ($('meta[name="google-adsense-account"]').attr("content") !== expectedAdsense) errors.push(`${page}: invalid adsense account meta`);
  if (verification && $('meta[name="google-site-verification"]').attr("content") !== verification) errors.push(`${page}: missing verification meta`);
  if (/localhost|example\.com/i.test(source)) errors.push(`${page}: placeholder domain found`);
  if (localized) {
    const locale = page.split("/")[1];
    if ($("html").attr("lang") !== locale) errors.push(`${page}: html lang mismatch`);
  }
  const href = canonical.attr("href") || "";
  if (!href.startsWith(siteUrl())) errors.push(`${page}: canonical is not absolute site URL`);
  checked += 1;
}
if (errors.length) fail(`Generated HTML audit failed (${errors.length}):\n${errors.slice(0,40).join("\n")}`); else pass(`Generated HTML audit passed for ${checked} indexable HTML files.`);
