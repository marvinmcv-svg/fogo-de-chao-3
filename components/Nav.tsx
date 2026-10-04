"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { List, X, Fire } from "@phosphor-icons/react";
import { gsap, reduced } from "@/lib/motion/gsap";
import Magnetic from "@/lib/motion/Magnetic";
import { openStatus, type Locale } from "@/lib/site";
import type { Dict } from "@/lib/i18n/dict";

export default function Nav({ locale, t }: { locale: Locale; t: Dict }) {
  const path = usePathname() || `/${locale}`;
  const bar = useRef<HTMLElement>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const [menu, setMenu] = useState(false);
  const [status, setStatus] = useState<ReturnType<typeof openStatus> | null>(null);
  const other = locale === "es" ? "en" : "es";
  const switchHref = path.replace(/^\/(es|en)/, `/${other}`) || `/${other}`;
  const home = `/${locale}`;

  useEffect(() => { setStatus(openStatus()); const i = setInterval(() => setStatus(openStatus()), 60_000); return () => clearInterval(i); }, []);

  // hide on scroll down, reveal on scroll up; solid after hero
  useEffect(() => {
    let last = 0;
    const onScroll = () => {
      const y = window.scrollY, el = bar.current; if (!el) return;
      el.dataset.solid = y > 80 ? "1" : "0";
      el.dataset.hidden = y > last && y > 400 ? "1" : "0";
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const w = window as unknown as { __lenis?: { stop(): void; start(): void } };
    if (menu) {
      w.__lenis?.stop(); document.body.style.overflow = "hidden";
      if (!reduced()) gsap.fromTo(sheet.current!.querySelectorAll("[data-m]"), { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "expo.out", stagger: 0.07 });
    } else { w.__lenis?.start(); document.body.style.overflow = ""; }
    return () => { document.body.style.overflow = ""; };
  }, [menu]);

  const hash = (id: string) => (path === home ? `#${id}` : `${home}#${id}`);
  const links = [
    { href: hash("menu"), label: t.nav.menu },
    { href: hash("historia"), label: t.nav.story },
    { href: hash("eventos"), label: t.nav.events },
    { href: hash("ubicacion"), label: t.nav.location },
    { href: `${home}/contacto`, label: t.nav.contact },
  ];

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[120] focus:rounded-full focus:bg-ember focus:px-4 focus:py-2 focus:text-white">{t.nav.skip}</a>
      <header
        ref={bar}
        data-solid="0"
        data-hidden="0"
        className="fixed inset-x-0 top-0 z-50 transition-[transform,background-color,backdrop-filter] duration-500 data-[hidden=1]:-translate-y-full data-[solid=1]:bg-ink/70 data-[solid=1]:backdrop-blur-xl"
      >
        <div className="wrap flex h-[72px] items-center justify-between gap-6">
          <Link href={home} aria-label="Fogo de Chão" className="shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/media/logo.webp" alt="Fogo de Chão" width={150} height={34} className="h-8 w-auto" />
          </Link>

          <nav aria-label="Principal" className="hidden items-center gap-8 lg:flex">
            {links.map((l) => (
              <Link key={l.label} href={l.href} className="group relative text-[.78rem] uppercase tracking-[.2em] text-bone/85 transition-colors hover:text-ember-hi">
                {l.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-ember-hi transition-transform duration-500 group-hover:scale-x-100" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {status && (
              <span className="hidden items-center gap-2 text-[.7rem] uppercase tracking-[.18em] text-tan xl:flex" aria-live="polite">
                <span className={`h-2 w-2 rounded-full ${status.open ? "bg-emerald-400 shadow-[0_0_10px_2px_rgba(52,211,153,.7)]" : "bg-mute"}`} />
                {status.nextLabel[locale]}
              </span>
            )}
            <Link href={switchHref} hrefLang={other} className="hidden px-2 text-[.72rem] uppercase tracking-[.2em] text-tan hover:text-ember-hi sm:block" aria-label={t.lang.label}>
              {other}
            </Link>
            <Magnetic>
              <Link href={hash("reservas")} className="btn btn-primary !min-h-[44px] !px-5"><Fire weight="fill" size={16} />{t.nav.reserve}</Link>
            </Magnetic>
            <button className="grid h-11 w-11 place-items-center rounded-full border border-line text-bone lg:hidden" onClick={() => setMenu(true)} aria-label="Menu" aria-expanded={menu}>
              <List size={20} />
            </button>
          </div>
        </div>
      </header>

      {menu && (
        <div ref={sheet} className="ember-bg fixed inset-0 z-[70] flex flex-col justify-between p-6 lg:hidden" role="dialog" aria-modal="true">
          <button className="ml-auto grid h-11 w-11 place-items-center rounded-full border border-line" onClick={() => setMenu(false)} aria-label={t.chat.close}><X size={20} /></button>
          <nav className="flex flex-col gap-3">
            {links.map((l) => (
              <Link key={l.label} data-m href={l.href} onClick={() => setMenu(false)} className="display text-5xl text-bone">{l.label}</Link>
            ))}
          </nav>
          <div data-m className="flex items-center justify-between">
            <Link href={switchHref} hrefLang={other} className="eyebrow" onClick={() => setMenu(false)}>{t.lang.label}</Link>
            <Link href={hash("reservas")} onClick={() => setMenu(false)} className="btn btn-primary">{t.nav.reserve}</Link>
          </div>
        </div>
      )}
    </>
  );
}
