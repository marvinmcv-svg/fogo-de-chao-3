import type { Metadata } from "next";
import { dicts } from "@/lib/i18n/dict";
import type { Locale } from "@/lib/site";
import Story from "@/components/sections/Story";
import Gallery from "@/components/sections/Gallery";

export const metadata: Metadata = { title: "Historia · Story" };

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  const t = dicts[locale];
  return <div className="pt-20"><Story t={t} locale={locale} link={false} /><Gallery t={t} locale={locale} /></div>;
}
