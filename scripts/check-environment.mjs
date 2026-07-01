import { env, pass, fail } from "./lib.mjs";

const site = env("NEXT_PUBLIC_SITE_URL").trim();
const adsense = env("NEXT_PUBLIC_ADSENSE_CLIENT", "ca-pub-9328837907414732").trim();
const verification = env("NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION").trim();
const contact = env("NEXT_PUBLIC_CONTACT_EMAIL").trim();
const booleans = ["NEXT_PUBLIC_ADSENSE_SCRIPT_ENABLED", "NEXT_PUBLIC_ADSENSE_MANUAL_ADS_ENABLED", "NEXT_PUBLIC_SHOW_AD_PLACEHOLDERS", "NEXT_PUBLIC_GOOGLE_CMP_ENABLED"];
let valid = true;
try {
  const parsed = new URL(site);
  if (parsed.protocol !== "https:") throw new Error("SITE_URL must use https://");
  if (/localhost|127\.0\.0\.1|example\.com/i.test(parsed.hostname)) throw new Error("SITE_URL cannot use a placeholder or localhost");
  if (site.endsWith("/") || /\s/.test(site)) throw new Error("SITE_URL must not contain whitespace or a trailing slash");
} catch (error) { fail(String(error)); valid = false; }
if (!/^ca-pub-\d{10,20}$/.test(adsense)) { fail("Invalid NEXT_PUBLIC_ADSENSE_CLIENT format"); valid = false; }
if (contact && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) { fail("Invalid contact email"); valid = false; }
for (const key of booleans) {
  const value = env(key, "false").trim().toLowerCase();
  if (!/^(true|false)$/.test(value)) { fail(`${key} must be true or false`); valid = false; }
}
console.log(`Environment summary: site=valid, contact=${contact ? "set" : "not set"}, verification=${verification ? "set" : "not set"}, adsense=set, script=${env("NEXT_PUBLIC_ADSENSE_SCRIPT_ENABLED", "false")}, manualAds=${env("NEXT_PUBLIC_ADSENSE_MANUAL_ADS_ENABLED", "false")}`);
if (valid) pass("Environment validation passed without printing sensitive values.");
