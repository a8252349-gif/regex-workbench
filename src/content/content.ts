import pageContentJson from "./page-content.generated.json";
import guidesJson from "./guides.generated.json";
import registryJson from "./registry.json";
import type { Locale } from "@/src/i18n/locales";

export type PageKey =
  | "home"
  | "tester"
  | "replace"
  | "extract"
  | "file-filter"
  | "explainer"
  | "cheat-sheet"
  | "guides"
  | "resources"
  | "how-it-works"
  | "faq"
  | "about"
  | "contact"
  | "privacy"
  | "terms"
  | "cookies"
  | "accessibility"
  | "editorial-policy"
  | "security"
  | "methodology";

export interface ContentSection {
  heading: string;
  paragraphs: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface PageContent {
  title: string;
  metaTitle: string;
  description: string;
  heading: string;
  intro: string;
  sections: ContentSection[];
  faq: FaqItem[];
  keywords: string[];
}

export interface GuideContent {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  intro: string;
  pattern: string;
  input: string;
  output: string;
  invalidPattern: string;
  sections: ContentSection[];
  table: { headers: string[]; rows: string[][] };
  checklist: string[];
  faq: FaqItem[];
  related: string[];
  lastReviewed: string;
  imageAlt: string;
}

const pageContent = pageContentJson as Record<Locale, Record<PageKey, PageContent>>;
const guideContent = guidesJson as Record<Locale, Record<string, GuideContent>>;

export const guideSlugs = registryJson.guides as readonly string[];
export const pagePaths = registryJson.pages as readonly string[];
export const lastModified = registryJson.lastModified;

export function getPageContent(locale: Locale, key: PageKey): PageContent {
  const value = pageContent[locale]?.[key];
  if (!value) throw new Error(`Missing page content: ${locale}/${key}`);
  return value;
}

export function getGuideContent(locale: Locale, slug: string): GuideContent {
  const value = guideContent[locale]?.[slug];
  if (!value) throw new Error(`Missing guide content: ${locale}/${slug}`);
  return value;
}

export function getAllGuides(locale: Locale): GuideContent[] {
  return guideSlugs.map((slug) => getGuideContent(locale, slug));
}
