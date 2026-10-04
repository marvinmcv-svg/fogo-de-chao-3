"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap, registerGsap, reduced } from "@/lib/motion/gsap";
import { SplitLines } from "@/lib/motion/Reveal";
import { timeline } from "@/content/data";
import type { Dict } from "@/lib/i18n/dict";
import type { Locale } from "@/lib/site";

/** Desktop: vertical scroll drives a horizontal track. Mobile: native horizontal swipe. */
export default function Story({ t, locale, link = true }: { t: Dict; locale: Locale; link?: boolean }) {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    if (reduced()) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const tr = track.current!;
      const dist = () => tr.scrollWidth - window.innerWidth + 96;
      const tween = gsap.to(tr, { x: () => -dist(), ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${dist()}`, scrub: 0.7, pin: true, anticipatePin: 1, invalidateOnRefresh: true } });
      gsap.utils.toArray<HTMLElement>("[data-card] img", tr).forEach((img) => {
        gsap.fromTo(img, { xPercent: -12 }, { xPercent: 12, ease: "none", scrollTrigger: { trigger: img.closest("[data-card]"), containerAnimation: tween, start: "left right", end: "right left", scrub: true } });
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} id="historia" className="relative overflow-hidden bg-ink py-24 lg:flex lg:min-h-[100dvh] lg:flex-col lg:justify-center lg:py-0">
      <div className="wrap mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow mb-6">{t.story.eyebrow}</p>
          <SplitLines className="display max-w-[16ch] text-5xl md:text-7xl" lines={[t.story.title]} />
        </div>
        {link && <Link href={`/${locale}/historia`} className="btn btn-ghost">{t.story.link}</Link>}
      </div>
      <div ref={track} className="flex gap-6 overflow-x-auto px-6 pb-4 [scrollbar-width:none] lg:w-max lg:overflow-visible lg:px-12 lg:pb-0">
        {timeline.map((s, i) => (
          <article key={s.year} data-card className="surface relative w-[82vw] shrink-0 overflow-hidden sm:w-[60vw] lg:w-[34vw]">
            <div className="relative h-[34vh] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.img} alt="" loading="lazy" className="absolute inset-0 h-full w-[124%] max-w-none -left-[12%] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-coal to-transparent" />
              <span className="display absolute bottom-3 left-6 text-6xl text-bone/90">{String(i + 1).padStart(2, "0")}</span>
            </div>
            <div className="p-7">
              <span className="eyebrow text-ember-hi">{s.year}</span>
              <h3 className="display mb-3 mt-2 text-3xl md:text-4xl">{s.title[locale]}</h3>
              <p className="text-mute">{s.body[locale]}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
