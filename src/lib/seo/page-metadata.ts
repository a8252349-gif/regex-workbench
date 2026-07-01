import type { Metadata } from "next";
import { getPageContent, type PageKey } from "@/src/content/content";
import { resolveLocale } from "@/src/lib/locale";
import { buildLocalizedMetadata } from "./build-localized-metadata";

export async function metadataForPage(params: Promise<{ locale: string }>, key: PageKey, path: string): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const content = getPageContent(locale, key);
  return buildLocalizedMetadata({ locale, pathname: path, title: content.metaTitle, description: content.description, keywords: content.keywords });
}
