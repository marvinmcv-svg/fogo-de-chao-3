"use client";
import { useState } from "react";
import { Gift, EnvelopeSimple } from "@phosphor-icons/react";
import { apiFetch } from "@/lib/api";
import { Reveal } from "@/lib/motion/Reveal";
import { waLink, type Locale } from "@/lib/site";
import type { Dict } from "@/lib/i18n/dict";

export default function GiftClub({ t, locale }: { t: Dict; locale: Locale }) {
  const [state, setState] = useState<"idle" | "busy" | "ok" | "err">("idle");
  async function join(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email") ?? "");
    setState("busy");
    try {
      const r = await apiFetch("/api/club", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email, locale }) });
      setState(r.ok ? "ok" : "err");
    } catch { setState("err"); }
  }
  return (
    <section className="bg-coal py-28">
      <Reveal className="wrap grid gap-5 lg:grid-cols-2" stagger={0.15}>
        <div className="surface relative flex min-h-[380px] flex-col justify-between overflow-hidden p-10">
          <div className="ember-bg absolute inset-0 -z-0 opacity-50" />
          <Gift size={36} className="relative text-ember-hi" weight="light" />
          <div className="relative">
            <p className="eyebrow mb-4">{t.gift.eyebrow}</p>
            <h2 className="display text-5xl md:text-6xl">{t.gift.title}</h2>
            <p className="mt-4 max-w-[40ch] text-bone/80">{t.gift.body}</p>
            <a href={waLink(t.gift.cta)} target="_blank" rel="noopener" className="btn btn-primary mt-8">{t.gift.cta}</a>
          </div>
        </div>
        <form onSubmit={join} className="surface flex min-h-[380px] flex-col justify-between p-10">
          <EnvelopeSimple size={36} className="text-ember-hi" weight="light" />
          <div>
            <p className="eyebrow mb-4">{t.gift.club}</p>
            <h2 className="display text-4xl md:text-5xl">{t.gift.clubBody}</h2>
            {state === "ok" ? (
              <p className="mt-8 text-lg text-tan" role="status">{t.gift.thanks}</p>
            ) : (
              <div className="field mt-8">
                <label htmlFor="club-email">{t.gift.email}</label>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input id="club-email" name="email" type="email" required autoComplete="email" aria-invalid={state === "err"} />
                  <button className="btn btn-primary" disabled={state === "busy"}>{t.gift.join}</button>
                </div>
                {state === "err" && <p className="err" role="alert">{t.reserve.err}</p>}
                <p className="mt-3 text-xs text-mute">{t.gift.legal}</p>
              </div>
            )}
          </div>
        </form>
      </Reveal>
    </section>
  );
}
