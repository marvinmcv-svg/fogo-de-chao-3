"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowDown } from "@phosphor-icons/react";
import { gsap, registerGsap, reduced } from "@/lib/motion/gsap";
import { SplitLines } from "@/lib/motion/Reveal";
import Magnetic from "@/lib/motion/Magnetic";
import EmberShader from "@/components/EmberShader";
import type { Dict } from "@/lib/i18n/dict";
import type { Locale } from "@/lib/site";

export default function Hero({ t, locale }: { t: Dict; locale: Locale }) {
  const root = useRef<HTMLElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const start = useRef(false);

  useEffect(() => {
    registerGsap();
    const el = root.current!;
    if (reduced()) return;
    const ctx = gsap.context(() => {
      // scroll-linked: video scales, text drifts up and fades
      gsap.to(media.current, { scale: 1.25, yPercent: 12, ease: "none", scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true } });
      gsap.to("[data-hero-copy]", { yPercent: -18, opacity: 0.1, ease: "none", scrollTrigger: { trigger: el, start: "top top", end: "70% top", scrub: true } });
      const intro = () => {
        if (start.current) return; start.current = true;
        gsap.from("[data-hero-in]", { y: 30, opacity: 0, duration: 1.1, ease: "power3.out", stagger: 0.12, delay: 0.5 });
        gsap.from("[data-hero-media]", { scale: 1.3, duration: 2.4, ease: "expo.out" });
      };
      if (document.documentElement.dataset.ready) intro(); else window.addEventListener("preloader:done", intro, { once: true });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="top" className="relative isolate min-h-[100dvh] overflow-hidden">
      <div ref={media} className="absolute inset-0 -z-10 will-change-transform">
        <video
          data-hero-media
          className="h-full w-full object-cover"
          src="/media/hero.mp4" poster="/img/hero-1.webp"
          autoPlay muted loop playsInline preload="metadata" aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/75 to-ink/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/50" />
        <EmberShader className="absolute inset-0 h-full w-full opacity-35 mix-blend-screen" />
      </div>

      <div data-hero-copy className="wrap relative flex min-h-[100dvh] flex-col justify-end pb-16 pt-24 md:pb-24">
        <p data-hero-in className="eyebrow mb-6 flex items-center gap-3"><span className="h-px w-10 bg-ember-hi" />{t.hero.eyebrow}</p>
        <SplitLines
          as="h1" trigger={false} delay={0.6}
          className="display max-w-[12ch] text-[clamp(3rem,8.4vw,8rem)] md:max-w-none text-bone"
          lines={[t.hero.title[0], <em key="b">{t.hero.title[1]}</em>]}
        />
        <p data-hero-in className="mt-8 max-w-[44ch] text-lg leading-relaxed text-bone/80">{t.hero.sub}</p>
        <div data-hero-in className="mt-10 flex flex-wrap items-center gap-4">
          <Magnetic><Link href="#reservas" className="btn btn-primary">{t.hero.cta}</Link></Magnetic>
          <Link href={`/${locale}/menu`} className="btn btn-ghost">{t.hero.cta2}</Link>
        </div>
      </div>

      <a href="#churrasco" aria-label={t.hero.scroll} className="absolute bottom-8 right-6 hidden h-14 w-14 place-items-center rounded-full border border-bone/30 text-bone backdrop-blur md:grid">
        <ArrowDown size={20} className="animate-bounce" />
      </a>
    </section>
  );
}
