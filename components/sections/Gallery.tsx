"use client";
import { useEffect, useState } from "react";
import { X } from "@phosphor-icons/react";
import { SplitLines, Reveal } from "@/lib/motion/Reveal";
import { gallery } from "@/content/data";
import type { Dict } from "@/lib/i18n/dict";
import type { Locale } from "@/lib/site";

export default function Gallery({ t, locale }: { t: Dict; locale: Locale }) {
  const [open, setOpen] = useState<number | null>(null);
  useEffect(() => {
    if (open === null) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open]);

  return (
    <section id="galeria" className="bg-coal py-28">
      <div className="wrap">
        <p className="eyebrow mb-6">{t.gallery.eyebrow}</p>
        <SplitLines className="display mb-14 text-5xl md:text-7xl" lines={[t.gallery.title]} />
        <Reveal className="grid auto-rows-[220px] gap-4 md:auto-rows-[260px] md:grid-cols-3" stagger={0.1} y={60}>
          {gallery.map((g, i) => (
            <button key={g.src} onClick={() => setOpen(i)} className={`group relative overflow-hidden rounded-[20px] ${g.span}`} aria-label={g.alt[locale]}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={g.src} alt={g.alt[locale]} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[var(--ease-out-expo)] group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <span className="eyebrow absolute bottom-4 left-5 translate-y-3 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">{g.alt[locale]}</span>
            </button>
          ))}
        </Reveal>
      </div>
      {open !== null && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-[80] grid place-items-center bg-ink/95 p-6 backdrop-blur" onClick={() => setOpen(null)}>
          <button className="absolute right-6 top-6 grid h-12 w-12 place-items-center rounded-full border border-line" aria-label={t.chat.close}><X size={22} /></button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={gallery[open].src} alt={gallery[open].alt[locale]} className="max-h-[85dvh] max-w-full rounded-[20px] object-contain" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </section>
  );
}
