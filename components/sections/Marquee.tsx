"use client";
import { useEffect, useRef } from "react";
import { gsap, registerGsap, ScrollTrigger, reduced } from "@/lib/motion/gsap";
import { cuts } from "@/content/data";
import type { Locale } from "@/lib/site";

/** Infinite marquee whose speed and direction follow scroll velocity. */
export default function Marquee({ locale }: { locale: Locale }) {
  const track = useRef<HTMLDivElement>(null);
  useEffect(() => {
    registerGsap();
    const el = track.current!;
    if (reduced()) return;
    const tween = gsap.to(el, { xPercent: -50, repeat: -1, duration: 38, ease: "none" });
    const st = ScrollTrigger.create({
      onUpdate: (self) => {
        const v = gsap.utils.clamp(-8, 8, self.getVelocity() / 300);
        gsap.to(tween, { timeScale: (self.direction === 1 ? 1 : -1) * (1 + Math.abs(v)), duration: 0.2, overwrite: true });
        gsap.to(tween, { timeScale: self.direction === 1 ? 1 : -1, delay: 0.25, duration: 1 });
      },
    });
    return () => { tween.kill(); st.kill(); };
  }, []);
  const items = [...cuts, ...cuts];
  return (
    <div className="relative overflow-hidden border-y border-line bg-coal py-6" aria-hidden>
      <div ref={track} className="flex w-max items-center gap-10 whitespace-nowrap">
        {[0, 1].map((k) => (
          <div key={k} className="flex items-center gap-10">
            {items.map((c, i) => (
              <span key={`${k}-${i}`} className="flex items-center gap-10">
                <span className="display text-5xl text-bone/90 md:text-7xl">{c[locale]}</span>
                <span className="h-2 w-2 rotate-45 bg-ember" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
