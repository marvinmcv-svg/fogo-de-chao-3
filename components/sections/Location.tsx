"use client";
import { MapPin, Phone, NavigationArrow } from "@phosphor-icons/react";
import { SplitLines, Reveal } from "@/lib/motion/Reveal";
import { SITE, type Locale } from "@/lib/site";
import type { Dict } from "@/lib/i18n/dict";

const q = encodeURIComponent("Ventura Mall, Av. 4to Anillo, Santa Cruz de la Sierra, Bolivia");

export default function Location({ t }: { t: Dict; locale?: Locale }) {
  return (
    <section id="ubicacion" className="bg-coal py-28">
      <div className="wrap grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="eyebrow mb-6">{t.loc.eyebrow}</p>
          <SplitLines className="display mb-8 text-5xl md:text-7xl" lines={[t.loc.title]} />
          <Reveal stagger={0.1} className="grid gap-8">
            <p className="flex gap-3 text-lg text-bone/85"><MapPin size={22} className="mt-1 shrink-0 text-ember-hi" />{SITE.address}</p>
            <div>
              <p className="eyebrow mb-3">{t.loc.hours} · {t.loc.daily}</p>
              <dl className="divide-y divide-line border-y border-line">
                <div className="flex justify-between py-3"><dt className="text-mute">{t.loc.lunch}</dt><dd>11:30 – 16:00</dd></div>
                <div className="flex justify-between py-3"><dt className="text-mute">{t.loc.dinner}</dt><dd>19:00 – 23:00</dd></div>
              </dl>
            </div>
            <div className="flex flex-wrap gap-3">
              <a className="btn btn-primary" href={`https://www.google.com/maps/dir/?api=1&destination=${q}`} target="_blank" rel="noopener"><NavigationArrow size={16} weight="fill" />{t.loc.directions}</a>
              <a className="btn btn-ghost" href={`tel:${SITE.phone}`}><Phone size={16} />{t.loc.call}</a>
            </div>
          </Reveal>
        </div>
        <div className="relative overflow-hidden rounded-[20px] border border-line bg-char lg:col-span-7">
          <MapPin size={40} weight="light" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-ember-hi" aria-hidden />
          <iframe title={t.loc.mapTitle} loading="lazy" referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps?q=${q}&output=embed`}
            className="relative h-[460px] w-full border-0 [filter:invert(.92)_hue-rotate(180deg)_saturate(.6)_brightness(.95)] lg:h-full" />
        </div>
      </div>
    </section>
  );
}
