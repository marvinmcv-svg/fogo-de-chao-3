"use client";
import { useRef } from "react";
import { SplitLines, ParallaxImage, Reveal } from "@/lib/motion/Reveal";
import type { Dict } from "@/lib/i18n/dict";

const IMG = ["/img/story-1.webp", "/img/story-2.webp", "/img/story-6.webp"];

/** 3 items = 3 cells: one tall feature plus two stacked. */
export default function Bento({ t }: { t: Dict }) {
  const ref = useRef<HTMLElement>(null);
  const cells = [
    "lg:col-span-7 lg:row-span-2 min-h-[460px]",
    "lg:col-span-5 min-h-[320px]",
    "lg:col-span-5 min-h-[320px]",
  ];
  return (
    <section ref={ref} className="bg-ink py-28">
      <div className="wrap">
        <p className="eyebrow mb-6">{t.bento.eyebrow}</p>
        <SplitLines className="display mb-14 text-5xl md:text-7xl" lines={[t.bento.title]} />
        <div className="grid gap-5 lg:grid-cols-12">
          {t.bento.items.map((it, i) => (
            <Reveal key={it.k} className={`group relative isolate flex ${cells[i]}`} delay={i * 0.1}>
              <ParallaxImage src={IMG[i]} alt="" className="!absolute inset-0 h-full w-full" amount={8} />
              <div className="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-t from-ink via-ink/55 to-ink/10" />
              <div className="relative z-10 mt-auto p-8">
                <span className="eyebrow text-ember-hi">{it.k}</span>
                <h3 className="display mt-2 text-4xl md:text-5xl">{it.t}</h3>
                <p className="mt-3 max-w-[38ch] text-bone/80">{it.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
