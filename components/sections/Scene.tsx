"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { gsap, registerGsap, reduced } from "@/lib/motion/gsap";
import { SplitLines } from "@/lib/motion/Reveal";
import type { Dict } from "@/lib/i18n/dict";

const EmberScene = dynamic(() => import("@/components/three/EmberScene"), { ssr: false });

function canRender3D() {
  if (typeof window === "undefined") return false;
  if (reduced()) return false;
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch { return false; }
}

/** 3D only mounts when the section is near the viewport; otherwise a static still. */
export default function Scene({ t }: { t: Dict }) {
  const root = useRef<HTMLElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    registerGsap();
    const el = root.current!;
    let io: IntersectionObserver | undefined;
    if (canRender3D()) {
      io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), { rootMargin: "200px" });
      io.observe(el);
    }
    const ctx = gsap.context(() => {
      if (reduced()) return;
      gsap.from("[data-scene-glow]", { scale: 0.6, opacity: 0, ease: "none", scrollTrigger: { trigger: el, start: "top 80%", end: "center center", scrub: true } });
    }, el);
    return () => { io?.disconnect(); ctx.revert(); };
  }, []);

  return (
    <section ref={root} className="relative isolate grid min-h-[100dvh] items-center overflow-hidden bg-coal">
      <div data-scene-glow className="absolute inset-0 -z-10 ember-bg opacity-80" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink via-transparent to-ink" />
      <div className="absolute inset-0 -z-0" data-cursor>{live ? <EmberScene /> : <div className="h-full w-full bg-[url('/img/hero-1.webp')] bg-cover bg-center opacity-30" />}</div>
      <div className="wrap pointer-events-none relative z-10 py-24">
        <p className="eyebrow mb-6">{t.scene.eyebrow}</p>
        <SplitLines className="display max-w-[12ch] text-[clamp(3rem,8vw,7.5rem)]" lines={[t.scene.title]} />
        <p className="mt-8 text-sm uppercase tracking-[.2em] text-tan">{t.scene.hint}</p>
      </div>
    </section>
  );
}
