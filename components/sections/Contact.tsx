"use client";
import { SplitLines, Reveal } from "@/lib/motion/Reveal";
import { waLink } from "@/lib/site";
import type { Dict } from "@/lib/i18n/dict";

export default function Contact({ t }: { t: Dict }) {
  return (
    <section className="bg-ink py-28">
      <div className="wrap grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SplitLines as="h1" className="display text-6xl md:text-8xl" lines={[t.contact.title]} />
          <p className="mt-6 max-w-[36ch] text-lg text-mute">{t.contact.sub}</p>
        </div>
        <Reveal className="lg:col-span-7">
          <form className="surface grid gap-5 p-8 md:p-10" onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            window.open(waLink(`${f.get("msg")}\n— ${f.get("name")}`), "_blank", "noopener");
          }}>
            <div className="field"><label htmlFor="c-name">{t.reserve.name}</label><input id="c-name" name="name" required autoComplete="name" /></div>
            <div className="field"><label htmlFor="c-msg">{t.contact.msg}</label><textarea id="c-msg" name="msg" required maxLength={800} /></div>
            <div><button className="btn btn-primary">{t.contact.send}</button></div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
