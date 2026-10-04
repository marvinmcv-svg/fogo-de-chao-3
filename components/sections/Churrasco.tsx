"use client";
import { useEffect, useRef } from "react";
import { gsap, registerGsap, reduced } from "@/lib/motion/gsap";
import { SplitLines } from "@/lib/motion/Reveal";
import type { Dict } from "@/lib/i18n/dict";

const IMGS = ["/img/hero-1.webp", "/img/hero-2.webp", "/img/story-1.webp"];

/** Desktop: section pins, the three steps scrub through with image crossfades. Mobile: plain stack. */
export default function Churrasco({ t }: { t: Dict }) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    registerGsap();
    const el = root.current!;
    if (reduced()) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const steps = gsap.utils.toArray<HTMLElement>("[data-step]", el);
      const imgs = gsap.utils.toArray<HTMLElement>("[data-img]", el);
      gsap.set(steps.slice(1), { opacity: 0.18, y: 20 });
      gsap.set(imgs.slice(1), { clipPath: "inset(100% 0 0 0)" });
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: el, start: "top top", end: "+=240%", scrub: 0.6, pin: true, anticipatePin: 1 },
      });
      tl.to("[data-bar]", { scaleY: 1, duration: 3 }, 0);
      for (let i = 1; i < steps.length; i++) {
        const at = i; // 1, 2
        tl.to(steps[i - 1], { opacity: 0.18, y: -20, duration: 0.4 }, at - 0.2)
          .to(steps[i], { opacity: 1, y: 0, duration: 0.4 }, at - 0.1)
          .to(imgs[i], { clipPath: "inset(0% 0 0 0)", duration: 0.7 }, at - 0.3)
          .fromTo(imgs[i].querySelector("img"), { scale: 1.3 }, { scale: 1, duration: 1 }, at - 0.3);
      }
      tl.to({}, { duration: 0.3 });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} id="churrasco" className="relative bg-ink py-24 lg:flex lg:min-h-[100dvh] lg:items-center lg:py-0">
      <div className="wrap grid items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <p className="eyebrow mb-6">{t.churrasco.eyebrow}</p>
          <SplitLines className="display mb-14 text-5xl md:text-7xl" lines={[t.churrasco.title]} />
          <div className="relative grid gap-10 pl-8">
            <div className="absolute bottom-0 left-0 top-0 w-px bg-line"><div data-bar className="h-full origin-top scale-y-100 bg-ember-hi lg:scale-y-0" /></div>
            {t.churrasco.steps.map((s, i) => (
              <div key={s.t} data-step>
                <span className="eyebrow text-ember-hi">0{i + 1}</span>
                <h3 className="display mb-3 mt-1 text-4xl md:text-5xl">{s.t}</h3>
                <p className="max-w-[46ch] text-lg leading-relaxed text-mute">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] lg:col-span-6 lg:col-start-7 lg:aspect-[5/6]">
          {IMGS.map((src, i) => (
            <div key={src} data-img className="absolute inset-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
              <span className="display absolute bottom-6 left-6 text-6xl text-bone/90">0{i + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
