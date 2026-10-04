import { dicts } from "@/lib/i18n/dict";
import type { Locale } from "@/lib/site";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  const t = dicts[locale];
  return (
    <section className="wrap min-h-[70dvh] pb-24 pt-40">
      <h1 className="display text-5xl md:text-7xl">{t.legal.termsTitle}</h1>
      <p className="mt-8 max-w-[60ch] text-mute">{t.legal.draft}</p>
    </section>
  );
}
