"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { gsap, registerGsap, reduced } from "./gsap";

/** Masked line-by-line reveal. Pass `lines` so each line slides up from inside its own clip. */
export function SplitLines({
  lines, as: Tag = "h2", className = "", delay = 0, trigger = true,
}: { lines: ReactNode[]; as?: "h1" | "h2" | "h3" | "p"; className?: string; delay?: number; trigger?: boolean }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    registerGsap();
    const el = ref.current;
    if (!el || reduced()) return;
    const spans = el.querySelectorAll<HTMLElement>(".mask-line > span");
    const ctx = gsap.context(() => {
      gsap.set(spans, { yPercent: 115, rotate: 3 });
      gsap.to(spans, {
        yPercent: 0, rotate: 0, duration: 1.3, ease: "expo.out", stagger: 0.12, delay,
        scrollTrigger: trigger ? { trigger: el, start: "top 85%", once: true } : undefined,
      });
    }, el);
    return () => ctx.revert();
  }, [delay, trigger]);
  const Comp = Tag as "h2";
  return (
    <Comp ref={ref} className={className}>
      {lines.map((l, i) => (
        <span key={i} className="mask-line"><span>{l}</span></span>
      ))}
    </Comp>
  );
}

/** Fade-up for any block, with optional stagger of direct children. */
export function Reveal({
  children, className = "", stagger = 0, y = 40, delay = 0,
}: { children: ReactNode; className?: string; stagger?: number; y?: number; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    registerGsap();
    const el = ref.current;
    if (!el || reduced()) return;
    const ctx = gsap.context(() => {
      const targets = stagger ? Array.from(el.children) : el;
      gsap.from(targets, {
        y, opacity: 0, duration: 1.1, ease: "power3.out", stagger, delay,
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
    }, el);
    return () => ctx.revert();
  }, [stagger, y, delay]);
  return <div ref={ref} className={className}>{children}</div>;
}

/** Image with a clip-path wipe plus scroll parallax. */
export function ParallaxImage({
  src, alt, className = "", amount = 12,
}: { src: string; alt: string; className?: string; amount?: number }) {
  const wrap = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLImageElement>(null);
  useEffect(() => {
    registerGsap();
    if (!wrap.current || !img.current || reduced()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(wrap.current, { clipPath: "inset(12% 12% 12% 12% round 20px)" }, {
        clipPath: "inset(0% 0% 0% 0% round 20px)", ease: "none",
        scrollTrigger: { trigger: wrap.current, start: "top 95%", end: "top 40%", scrub: true },
      });
      gsap.fromTo(img.current, { yPercent: -amount, scale: 1.25 }, {
        yPercent: amount, scale: 1.1, ease: "none",
        scrollTrigger: { trigger: wrap.current, start: "top bottom", end: "bottom top", scrub: true },
      });
    }, wrap);
    return () => ctx.revert();
  }, [amount]);
  return (
    <div ref={wrap} className={`relative overflow-hidden rounded-[20px] ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img ref={img} src={src} alt={alt} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
    </div>
  );
}
