"use client";
import { useEffect, useRef } from "react";
import { gsap, reduced } from "@/lib/motion/gsap";

/** Ember cursor for fine pointers. Never touches React state. */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (reduced() || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    document.body.classList.add("has-cursor");
    const dx = gsap.quickTo(dot.current, "x", { duration: 0.1 });
    const dy = gsap.quickTo(dot.current, "y", { duration: 0.1 });
    const rx = gsap.quickTo(ring.current, "x", { duration: 0.5, ease: "power3" });
    const ry = gsap.quickTo(ring.current, "y", { duration: 0.5, ease: "power3" });
    const move = (e: PointerEvent) => { dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); };
    const over = (e: PointerEvent) => {
      const hot = (e.target as HTMLElement).closest("a, button, [data-cursor], input, select, textarea, summary");
      gsap.to(ring.current, { scale: hot ? 1.9 : 1, opacity: hot ? 0.9 : 0.6, duration: 0.35 });
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerover", over);
    return () => {
      document.body.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
    };
  }, []);
  return (
    <>
      <div ref={ring} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[95] -ml-5 -mt-5 hidden h-10 w-10 rounded-full border border-ember-hi opacity-60 mix-blend-screen [.has-cursor_&]:block" />
      <div ref={dot} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[96] -ml-[3px] -mt-[3px] hidden h-[6px] w-[6px] rounded-full bg-ember-hi [.has-cursor_&]:block" />
    </>
  );
}
