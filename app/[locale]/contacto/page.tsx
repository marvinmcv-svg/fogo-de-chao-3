import type { Metadata } from "next";
import { dicts } from "@/lib/i18n/dict";
import type { Locale } from "@/lib/site";
import Contact from "@/components/sections/Contact";
import GiftClub from "@/components/sections/GiftClub";

export const metadata: Metadata = { title: "Contacto · Contact" };

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  const t = dicts[locale];
  return <div className="pt-20"><Contact t={t} /><GiftClub t={t} locale={locale} /></div>;
}
