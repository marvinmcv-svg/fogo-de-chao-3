"use client";
import { useEffect, useRef, useState } from "react";
import { ChatsCircle, PaperPlaneTilt, X, Fire, WhatsappLogo } from "@phosphor-icons/react";
import { gsap, reduced } from "@/lib/motion/gsap";
import { SITE, waLink, type Locale } from "@/lib/site";
import type { Dict } from "@/lib/i18n/dict";

type Msg = { role: "user" | "assistant"; content: string; wa?: string };

export default function Receptionist({ t, locale }: { t: Dict; locale: Locale }) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "assistant", content: t.chat.greeting }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const last = useRef<Msg[]>([]);

  useEffect(() => { setMsgs((m) => (m.length === 1 ? [{ role: "assistant", content: t.chat.greeting }] : m)); }, [t.chat.greeting]);
  useEffect(() => { scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" }); }, [msgs, busy]);
  useEffect(() => {
    if (open && panel.current && !reduced()) gsap.fromTo(panel.current, { y: 30, opacity: 0, scale: 0.96 }, { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "expo.out" });
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open]);
  useEffect(() => {
    const h = () => setOpen(true);
    window.addEventListener("open-receptionist", h);
    return () => window.removeEventListener("open-receptionist", h);
  }, []);

  async function ask(history: Msg[]) {
    setBusy(true); setFailed(false);
    last.current = history;
    setMsgs([...history, { role: "assistant", content: "" }]);
    try {
      const res = await fetch("/api/chat", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ locale, messages: history.filter((m, i) => !(i === 0 && m.role === "assistant")).map(({ role, content }) => ({ role, content })) }),
      });
      if (!res.ok || !res.body) throw new Error(String(res.status));
      const reader = res.body.getReader(); const dec = new TextDecoder(); let buf = ""; let acc = "";
      for (;;) {
        const { value, done } = await reader.read(); if (done) break;
        buf += dec.decode(value, { stream: true });
        let nl: number;
        while ((nl = buf.indexOf("\n")) >= 0) {
          const raw = buf.slice(0, nl).trim(); buf = buf.slice(nl + 1); if (!raw) continue;
          const ev = JSON.parse(raw);
          if (ev.t === "text") { acc += ev.v; setMsgs([...history, { role: "assistant", content: acc }]); }
          else if (ev.t === "wa") { setMsgs((m) => m.map((x, i) => (i === m.length - 1 ? { ...x, wa: ev.url } : x))); }
          else if (ev.t === "error") throw new Error("stream");
        }
      }
      if (!acc) setMsgs((m) => m.slice(0, -1).concat({ role: "assistant", content: "…", wa: m[m.length - 1].wa }));
    } catch {
      setMsgs(history); setFailed(true);
    } finally { setBusy(false); }
  }

  function send(text: string) {
    const v = text.trim(); if (!v || busy) return;
    setInput("");
    void ask([...msgs.filter((m) => m.content !== ""), { role: "user", content: v }]);
  }

  return (
    <>
      {!open && (
        <button onClick={() => setOpen(true)} aria-label={t.chat.open}
          className="fixed bottom-5 right-5 z-[60] flex h-14 items-center gap-3 rounded-full bg-ember pl-4 pr-5 text-white shadow-[0_12px_40px_-8px_rgba(226,83,31,.8)] transition-transform hover:scale-105 active:scale-95">
          <span className="relative grid h-8 w-8 place-items-center"><span className="absolute inset-0 animate-ping rounded-full bg-white/30" /><ChatsCircle size={26} weight="fill" className="relative" /></span>
          <span className="hidden text-xs font-semibold uppercase tracking-[.16em] sm:block">{t.chat.title}</span>
        </button>
      )}
      {open && (
        <div ref={panel} role="dialog" aria-label={t.chat.title}
          className="fixed bottom-0 right-0 z-[75] flex h-[min(680px,100dvh)] w-full flex-col overflow-hidden border border-line bg-coal shadow-2xl sm:bottom-5 sm:right-5 sm:w-[400px] sm:rounded-[20px]">
          <header className="flex items-center justify-between gap-3 border-b border-line bg-char px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-ember text-white"><Fire size={20} weight="fill" /></span>
              <div><p className="font-semibold leading-tight">{t.chat.title}</p><p className="text-xs text-tan">{t.chat.sub}</p></div>
            </div>
            <button onClick={() => setOpen(false)} aria-label={t.chat.close} className="grid h-10 w-10 place-items-center rounded-full hover:bg-line"><X size={18} /></button>
          </header>

          <div ref={scroller} className="flex-1 space-y-3 overflow-y-auto px-5 py-5" aria-live="polite">
            {msgs.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <div className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-[.95rem] leading-relaxed ${m.role === "user" ? "rounded-br-md bg-ember text-white" : "rounded-bl-md bg-char text-bone"}`}>
                  {m.content === "" && busy ? <span className="flex gap-1.5 py-1.5" aria-label="…"><i className="skeleton h-2 w-2 !rounded-full" /><i className="skeleton h-2 w-2 !rounded-full" /><i className="skeleton h-2 w-2 !rounded-full" /></span> : m.content}
                  {m.wa && <a href={m.wa} target="_blank" rel="noopener" className="btn btn-primary mt-3 !min-h-[40px] !px-4 !text-[.7rem]"><WhatsappLogo size={16} weight="fill" />{t.reserve.okBtn}</a>}
                </div>
              </div>
            ))}
            {msgs.length === 1 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {t.chat.chips.map((c) => <button key={c} onClick={() => send(c)} className="rounded-full border border-line px-3.5 py-2 text-sm text-tan transition-colors hover:border-ember-hi hover:text-ember-hi">{c}</button>)}
              </div>
            )}
            {failed && (
              <div className="rounded-2xl border border-line p-4 text-sm" role="alert">
                <p className="text-bone">{t.chat.error}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button onClick={() => void ask(last.current)} className="btn btn-ghost !min-h-[38px] !px-4 !text-[.68rem]">{t.chat.retry}</button>
                  <a href={waLink(t.wa.msg)} target="_blank" rel="noopener" className="btn btn-primary !min-h-[38px] !px-4 !text-[.68rem]">{t.chat.human}</a>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="border-t border-line bg-char p-3">
            <div className="flex items-center gap-2">
              <label htmlFor="chat-in" className="sr-only">{t.chat.placeholder}</label>
              <input id="chat-in" value={input} onChange={(e) => setInput(e.target.value)} maxLength={1000} placeholder={t.chat.placeholder} autoComplete="off"
                className="min-h-[48px] flex-1 rounded-full border border-[#4a4239] bg-coal px-5 text-bone placeholder:text-mute focus:border-ember-hi focus:outline-none" />
              <button aria-label={t.chat.send} disabled={busy || !input.trim()} className="grid h-12 w-12 place-items-center rounded-full bg-ember text-white transition-transform active:scale-95 disabled:opacity-40"><PaperPlaneTilt size={20} weight="fill" /></button>
            </div>
            <p className="mt-2 px-2 text-[.68rem] leading-snug text-mute">{t.chat.disclaimer} · <a className="underline" href={`tel:${SITE.phone}`}>{SITE.phoneLabel}</a></p>
          </form>
        </div>
      )}
    </>
  );
}
