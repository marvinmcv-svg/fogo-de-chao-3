"use client";
import { Plus } from "@phosphor-icons/react";
import { SplitLines, Reveal } from "@/lib/motion/Reveal";
import { faq } from "@/content/data";
import type { Dict } from "@/lib/i18n/dict";
import type { Locale } from "@/lib/site";

export default function Faq({ t, locale }: { t: Dict; locale: Locale }) {
  return (
    <section id="faq" className="bg-ink py-28">
      <div className="wrap grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="eyebrow mb-6">{t.faq.eyebrow}</p>
          <SplitLines className="display text-5xl md:text-7xl" lines={[t.faq.title]} />
        </div>
        <Reveal className="lg:col-span-8">
          {faq.map((f) => (
            <details key={f.q.es} className="group border-t border-line py-6 last:border-b">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-xl md:text-2xl [&::-webkit-details-marker]:hidden">
                <span className="display text-3xl md:text-4xl">{f.q[locale]}</span>
                <Plus size={24} className="shrink-0 text-ember-hi transition-transform duration-500 group-open:rotate-[135deg]" />
              </summary>
              <p className="mt-4 max-w-[60ch] text-lg leading-relaxed text-mute">{f.a[locale]}</p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
