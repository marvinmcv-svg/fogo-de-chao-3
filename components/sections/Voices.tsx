"use client";
import { SplitLines, Reveal } from "@/lib/motion/Reveal";
import { testimonials } from "@/content/data";
import type { Dict } from "@/lib/i18n/dict";
import type { Locale } from "@/lib/site";

export default function Voices({ t, locale }: { t: Dict; locale: Locale }) {
  return (
    <section className="bg-ink py-28">
      <div className="wrap">
        <p className="eyebrow mb-6">{t.voices.eyebrow}</p>
        <SplitLines className="display mb-14 max-w-[16ch] text-5xl md:text-7xl" lines={[t.voices.title]} />
        <Reveal className="grid gap-5 md:grid-cols-3" stagger={0.12}>
          {testimonials.map((q) => (
            <figure key={q.quote.es} className="surface p-8">
              <blockquote className="display text-3xl leading-tight text-bone md:text-4xl">“{q.quote[locale]}”</blockquote>
              <figcaption className="eyebrow mt-8 text-mute">{q.who}</figcaption>
            </figure>
          ))}
        </Reveal>
        <p className="mt-6 text-xs text-mute">{t.voices.placeholder}</p>
      </div>
    </section>
  );
}
