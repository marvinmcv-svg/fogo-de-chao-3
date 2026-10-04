"use client";
import { useEffect, useState } from "react";
import { WhatsappLogo, X } from "@phosphor-icons/react";
import { waLink } from "@/lib/site";
import type { Dict } from "@/lib/i18n/dict";

/** Bottom-left so it never collides with the AI chat launcher (bottom-right). */
export default function WhatsAppWidget({ t }: { t: Dict }) {
  const [bubble, setBubble] = useState(false);
  useEffect(() => {
    let dismissed = false;
    try { dismissed = sessionStorage.getItem("wa-dismissed") === "1"; } catch {}
    if (dismissed) return;
    const id = setTimeout(() => setBubble(true), 9000);
    return () => clearTimeout(id);
  }, []);
  const close = () => { setBubble(false); try { sessionStorage.setItem("wa-dismissed", "1"); } catch {} };
  return (
    <div className="fixed bottom-5 left-5 z-[60] flex items-end gap-3">
      <a href={waLink(t.wa.msg)} target="_blank" rel="noopener" aria-label={t.wa.label}
        className="relative grid h-14 w-14 place-items-center rounded-full bg-[#1f9d55] text-white shadow-[0_12px_40px_-8px_rgba(31,157,85,.8)] transition-transform hover:scale-105 active:scale-95">
        <span className="absolute inset-0 animate-ping rounded-full bg-[#1f9d55]/40 [animation-duration:2.8s]" />
        <WhatsappLogo size={30} weight="fill" className="relative" />
      </a>
      {bubble && (
        <div role="status" className="relative mb-1 hidden max-w-[240px] rounded-2xl rounded-bl-md border border-line bg-char py-3 pl-4 pr-9 text-sm text-bone shadow-xl sm:block animate-[pop_.5s_var(--ease-out-expo)]">
          {t.wa.bubble}
          <button onClick={close} aria-label="Cerrar" className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full text-mute hover:text-bone"><X size={12} /></button>
        </div>
      )}
      <style>{"@keyframes pop{from{opacity:0;transform:translateX(-12px) scale(.9)}to{opacity:1;transform:none}}"}</style>
    </div>
  );
}
