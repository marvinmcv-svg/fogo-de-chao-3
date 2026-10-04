import type { Metadata } from "next";
import { dicts } from "@/lib/i18n/dict";
import type { Locale } from "@/lib/site";
import Reserve from "@/components/sections/Reserve";

export const metadata: Metadata = { title: "Reservas · Reservations" };

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  return <div className="pt-20"><Reserve t={dicts[locale]} locale={locale} /></div>;
}
