"use client";
import { useEffect, useRef } from "react";
import { gsap, reduced } from "@/lib/motion/gsap";

export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = root.current!;
    const done = () => { el.style.display = "none"; document.documentElement.dataset.ready = "1"; window.dispatchEvent(new Event("preloader:done")); };
    if (reduced() || sessionStorageSeen()) return done();
    const num = el.querySelector<HTMLElement>("[data-count]")!;
    const counter = { v: 0 };
    const tl = gsap.timeline({ onComplete: done });
    tl.fromTo("[data-pl-line]", { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: "power2.inOut" }, 0)
      .to(counter, { v: 100, duration: 1.4, ease: "power2.inOut", onUpdate: () => { num.textContent = String(Math.round(counter.v)).padStart(2, "0"); } }, 0)
      .from("[data-pl-logo]", { opacity: 0, y: 24, duration: 0.9, ease: "power3.out" }, 0.1)
      .to("[data-pl-inner]", { opacity: 0, y: -30, duration: 0.5, ease: "power2.in" }, 1.55)
      .to(el, { yPercent: -100, duration: 0.95, ease: "expo.inOut" }, 1.7);
    try { sessionStorage.setItem("fogo-seen", "1"); } catch {}
    return () => { tl.kill(); };
  }, []);
  return (
    <>
      <noscript><style>{"#preloader{display:none!important}"}</style></noscript>
      <div id="preloader" ref={root} className="fixed inset-0 z-[100] grid place-items-center bg-ink" role="status" aria-label="Loading">
        <div data-pl-inner className="flex w-[min(420px,80vw)] flex-col items-center gap-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img data-pl-logo src="/media/logo.webp" alt="Fogo de Chão" width={260} height={60} className="h-auto w-[220px]" />
          <div className="h-px w-full bg-line"><div data-pl-line className="h-px origin-left bg-ember-hi shadow-[0_0_20px_2px_rgba(255,122,61,.8)]" /></div>
          <span data-count className="eyebrow tabular-nums">00</span>
        </div>
      </div>
    </>
  );
}

function sessionStorageSeen() {
  try { return sessionStorage.getItem("fogo-seen") === "1"; } catch { return false; }
}
