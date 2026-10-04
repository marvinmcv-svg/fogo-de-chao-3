import type { Metadata } from "next";
import { dicts } from "@/lib/i18n/dict";
import type { Locale } from "@/lib/site";
import Menu from "@/components/sections/Menu";

export const metadata: Metadata = { title: "Menú · Menu" };

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  return <div className="pt-20"><Menu t={dicts[locale]} locale={locale} full /></div>;
}
