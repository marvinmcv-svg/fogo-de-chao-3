import type { Metadata } from "next";
import { dicts } from "@/lib/i18n/dict";
import type { Locale } from "@/lib/site";
import Location from "@/components/sections/Location";
import Faq from "@/components/sections/Faq";

export const metadata: Metadata = { title: "Ubicación · Location" };

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  const t = dicts[locale];
  return <div className="pt-20"><Location t={t} /><Faq t={t} locale={locale} /></div>;
}
