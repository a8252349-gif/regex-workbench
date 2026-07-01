import type { Metadata } from "next";
import { StaticInfoPage } from "@/src/components/static-info-page";
import { resolveLocale } from "@/src/lib/locale";
import { metadataForPage } from "@/src/lib/seo/page-metadata";
export function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> { return metadataForPage(params,"cookies","cookies"); }
export default async function Page({ params }: { params: Promise<{ locale: string }> }) { const locale=await resolveLocale(params); return <StaticInfoPage locale={locale} pageKey="cookies" path="cookies" />; }
