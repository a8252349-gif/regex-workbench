import { locales, type Locale } from "@/src/i18n/locales";

function normalizeSiteUrl(raw: string | undefined): string {
  const value = raw?.trim();
  if (!value) {
    if (process.env.NODE_ENV !== "production") return "http://localhost:3000";
    throw new Error("NEXT_PUBLIC_SITE_URL is required for production builds.");
  }
  return value.replace(/\/+$/, "");
}

function parseBoolean(value: string | undefined): boolean {
  return (value || "").trim().toLowerCase() === "true";
}

export const siteConfig = {
  name: "Regex Workbench",
  url: normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL),
  contactEmail: (process.env.NEXT_PUBLIC_CONTACT_EMAIL || "").trim(),
  googleSiteVerification: (process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "").trim(),
  adsenseClient: (process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-9328837907414732").trim(),
  adsenseScriptEnabled: parseBoolean(process.env.NEXT_PUBLIC_ADSENSE_SCRIPT_ENABLED),
  adsenseManualAdsEnabled: parseBoolean(process.env.NEXT_PUBLIC_ADSENSE_MANUAL_ADS_ENABLED),
  showAdPlaceholders: parseBoolean(process.env.NEXT_PUBLIC_SHOW_AD_PLACEHOLDERS),
  googleCmpEnabled: parseBoolean(process.env.NEXT_PUBLIC_GOOGLE_CMP_ENABLED),
  buildVersion: (process.env.NEXT_PUBLIC_BUILD_VERSION || "local").trim(),
  locales
} as const;

export function absoluteUrl(pathname: string): string {
  const normalized = pathname === "/" ? "/" : `/${pathname.replace(/^\/+|\/+$/g, "")}/`;
  return `${siteConfig.url}${normalized}`;
}

export function localizedPath(locale: Locale, pathname = ""): string {
  const clean = pathname.replace(/^\/+|\/+$/g, "");
  return clean ? `/${locale}/${clean}/` : `/${locale}/`;
}
