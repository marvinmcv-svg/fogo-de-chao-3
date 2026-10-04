"use client";
import { SplitLines, Reveal } from "@/lib/motion/Reveal";
import { events } from "@/content/data";
import { waLink, type Locale } from "@/lib/site";
import type { Dict } from "@/lib/i18n/dict";
import { ArrowUpRight } from "@phosphor-icons/react";

export default function Events({ t, locale }: { t: Dict; locale: Locale }) {
  return (
    <section id="eventos" className="bg-ink py-28">
      <div className="wrap">
        <p className="eyebrow mb-6">{t.events.eyebrow}</p>
        <SplitLines className="display mb-14 max-w-[14ch] text-5xl md:text-7xl" lines={[t.events.title]} />
        <Reveal stagger={0.12}>
          {events.map((e, i) => (
            <a key={e.title.es} href={waLink(`${t.events.cta}: ${e.title[locale]}`)} target="_blank" rel="noopener"
              className="group grid grid-cols-[auto_1fr_auto] items-center gap-6 border-t border-line py-9 transition-colors hover:bg-coal md:gap-12 md:px-6">
              <span className="display text-3xl text-ember-hi md:text-5xl">0{i + 1}</span>
              <div>
                <h3 className="display text-4xl transition-transform duration-500 group-hover:translate-x-3 md:text-6xl">{e.title[locale]}</h3>
                <p className="mt-2 text-mute">{e.body[locale]}</p>
              </div>
              <span className="grid h-14 w-14 place-items-center rounded-full border border-line transition-all duration-500 group-hover:rotate-45 group-hover:border-ember-hi group-hover:bg-ember group-hover:text-white"><ArrowUpRight size={22} /></span>
            </a>
          ))}
          <div className="border-t border-line" />
        </Reveal>
      </div>
    </section>
  );
}
