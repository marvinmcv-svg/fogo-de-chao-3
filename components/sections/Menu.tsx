"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { gsap, reduced } from "@/lib/motion/gsap";
import { SplitLines } from "@/lib/motion/Reveal";
import { menu } from "@/content/data";
import type { Dict } from "@/lib/i18n/dict";
import type { Locale } from "@/lib/site";

type Filter = "all" | "veg" | "gf";

export default function Menu({ t, locale, full = false }: { t: Dict; locale: Locale; full?: boolean }) {
  const [cat, setCat] = useState(menu[0].id);
  const [filter, setFilter] = useState<Filter>("all");
  const list = useRef<HTMLDivElement>(null);
  const active = menu.find((m) => m.id === cat)!;
  const items = useMemo(() => active.items.filter((i) => filter === "all" || i.tags?.includes(filter)), [active, filter]);

  useEffect(() => {
    if (reduced() || !list.current) return;
    gsap.fromTo(list.current.children, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", stagger: 0.07 });
  }, [cat, filter]);

  const tabs = (
    <div role="tablist" aria-label={t.menu.title} className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none]">
      {menu.map((m) => (
        <button key={m.id} role="tab" aria-selected={cat === m.id} onClick={() => setCat(m.id)}
          className={`btn !min-h-[44px] shrink-0 !px-5 ${cat === m.id ? "btn-primary" : "btn-ghost"}`}>
          {m.title[locale]}
        </button>
      ))}
    </div>
  );

  return (
    <section id="menu" className="bg-coal py-28">
      <div className="wrap">
        <p className="eyebrow mb-6">{t.menu.eyebrow}</p>
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <SplitLines as={full ? "h1" : "h2"} className="display text-5xl md:text-7xl" lines={[t.menu.title]} />
          <div className="flex gap-2" role="group" aria-label="Filter">
            {(["all", "veg", "gf"] as Filter[]).map((f) => (
              <button key={f} aria-pressed={filter === f} onClick={() => setFilter(f)}
                className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[.16em] transition-colors ${filter === f ? "border-ember-hi bg-ember-hi text-ink" : "border-line text-tan hover:border-tan"}`}>
                {t.menu.filters[f]}
              </button>
            ))}
          </div>
        </div>
        {tabs}
        <p className="mt-8 max-w-[56ch] text-lg text-mute">{active.blurb[locale]}</p>
        <div ref={list} role="tabpanel" className="mt-10 grid gap-x-12 md:grid-cols-2">
          {items.length === 0 && <p className="py-10 text-mute">{t.menu.empty}</p>}
          {items.map((i) => (
            <article key={i.name.es} className="border-t border-line py-7">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="display text-3xl md:text-4xl">{i.name[locale]}</h3>
                <span className="flex gap-1.5">
                  {i.tags?.map((tag) => (
                    <span key={tag} className={`rounded-full border px-2.5 py-0.5 text-[.65rem] uppercase tracking-[.14em] ${tag === "signature" ? "border-ember-hi text-ember-hi" : "border-line text-tan"}`}>{t.menu.tags[tag]}</span>
                  ))}
                </span>
              </div>
              <p className="mt-2 max-w-[48ch] text-mute">{i.desc[locale]}</p>
            </article>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8">
          <p className="text-sm text-mute">{t.menu.note}</p>
          {!full && <Link href={`/${locale}/menu`} className="btn btn-ghost">{t.menu.all}</Link>}
        </div>
      </div>
    </section>
  );
}
