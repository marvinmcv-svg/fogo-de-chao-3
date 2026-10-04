"use client";
import { useState } from "react";
import { SplitLines, Reveal } from "@/lib/motion/Reveal";
import { apiFetch } from "@/lib/api";
import { bookingSlots, waLink, type Locale } from "@/lib/site";
import type { Dict } from "@/lib/i18n/dict";

type Errs = Partial<Record<"name" | "phone" | "date" | "time", string>>;
const slots = bookingSlots();
const today = () => new Intl.DateTimeFormat("en-CA", { timeZone: "America/La_Paz" }).format(new Date());

export default function Reserve({ t, locale }: { t: Dict; locale: Locale }) {
  const [errs, setErrs] = useState<Errs>({});
  const [state, setState] = useState<"idle" | "busy" | "ok" | "err">("idle");
  const [wa, setWa] = useState("");
  const [guests, setGuests] = useState(2);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const v = Object.fromEntries(f.entries()) as Record<string, string>;
    const next: Errs = {};
    if (v.name.trim().length < 2) next.name = t.reserve.errName;
    if (!/^[+\d][\d\s()-]{5,22}$/.test(v.phone.trim())) next.phone = t.reserve.errPhone;
    if (!v.date || v.date < today()) next.date = t.reserve.errDate;
    if (!v.time) next.time = t.reserve.errTime;
    setErrs(next);
    if (Object.keys(next).length) return;

    setState("busy");
    try {
      const r = await apiFetch("/api/reserve", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...v, party_size: Number(v.party_size), locale, source: "web" }) });
      if (!r.ok) throw new Error(String(r.status));
      setWa(waLink(t.reserve.waText.replace("{name}", v.name).replace("{guests}", v.party_size).replace("{date}", v.date).replace("{time}", v.time)));
      setState("ok");
    } catch { setState("err"); }
  }

  return (
    <section id="reservas" className="ember-bg relative py-28">
      <div className="wrap grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="eyebrow mb-6">{t.reserve.eyebrow}</p>
          <SplitLines className="display text-5xl md:text-7xl" lines={[t.reserve.title]} />
          <p className="mt-6 max-w-[34ch] text-lg text-bone/80">{t.reserve.sub}</p>
        </div>
        <Reveal className="lg:col-span-7">
          {state === "ok" ? (
            <div className="surface p-10" role="status">
              <p className="display text-4xl md:text-5xl">{t.reserve.ok}</p>
              <a href={wa} target="_blank" rel="noopener" className="btn btn-primary mt-8">{t.reserve.okBtn}</a>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="surface grid gap-5 p-8 md:grid-cols-2 md:p-10">
              <div className="field"><label htmlFor="r-name">{t.reserve.name}</label>
                <input id="r-name" name="name" autoComplete="name" aria-invalid={!!errs.name} aria-describedby={errs.name ? "e-name" : undefined} />
                {errs.name && <p id="e-name" className="err">{errs.name}</p>}</div>
              <div className="field"><label htmlFor="r-phone">{t.reserve.phone}</label>
                <input id="r-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" aria-invalid={!!errs.phone} aria-describedby={errs.phone ? "e-phone" : undefined} />
                {errs.phone && <p id="e-phone" className="err">{errs.phone}</p>}</div>
              <div className="field"><label htmlFor="r-date">{t.reserve.date}</label>
                <input id="r-date" name="date" type="date" min={today()} aria-invalid={!!errs.date} aria-describedby={errs.date ? "e-date" : undefined} />
                {errs.date && <p id="e-date" className="err">{errs.date}</p>}</div>
              <div className="field"><label htmlFor="r-time">{t.reserve.time}</label>
                <select id="r-time" name="time" defaultValue="" aria-invalid={!!errs.time} aria-describedby={errs.time ? "e-time" : undefined}>
                  <option value="" disabled>—</option>
                  <optgroup label={t.reserve.lunch}>{slots.filter((s) => s < "17:00").map((s) => <option key={s}>{s}</option>)}</optgroup>
                  <optgroup label={t.reserve.dinner}>{slots.filter((s) => s >= "17:00").map((s) => <option key={s}>{s}</option>)}</optgroup>
                </select>
                {errs.time && <p id="e-time" className="err">{errs.time}</p>}</div>
              <div className="field"><label htmlFor="r-guests">{t.reserve.guests}</label>
                <select id="r-guests" name="party_size" value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
                <p className="mt-2 text-xs text-mute">{t.reserve.large}</p></div>
              <div className="field"><label htmlFor="r-email">{t.reserve.email}</label><input id="r-email" name="email" type="email" autoComplete="email" /></div>
              <div className="field md:col-span-2"><label htmlFor="r-notes">{t.reserve.notes}</label><textarea id="r-notes" name="notes" maxLength={500} /></div>
              {state === "err" && <p className="err md:col-span-2" role="alert">{t.reserve.err}</p>}
              <div className="md:col-span-2"><button className="btn btn-primary" disabled={state === "busy"}>{state === "busy" ? t.reserve.sending : t.reserve.send}</button></div>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
