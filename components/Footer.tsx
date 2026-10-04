import Link from "next/link";
import { FacebookLogo, InstagramLogo, WhatsappLogo, Phone } from "@phosphor-icons/react/dist/ssr";
import { SITE, waLink, type Locale } from "@/lib/site";
import type { Dict } from "@/lib/i18n/dict";

export default function Footer({ t, locale }: { t: Dict; locale: Locale }) {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-ink pt-20">
      <div className="wrap grid gap-12 pb-16 md:grid-cols-3">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/media/logo.webp" alt="Fogo de Chão" width={180} height={41} className="h-10 w-auto" />
          <p className="mt-5 max-w-[30ch] text-mute">{t.footer.tag}</p>
        </div>
        <address className="not-italic text-mute">
          <p className="eyebrow mb-4">{t.footer.contact}</p>
          <p>{SITE.address}</p>
          <p className="mt-3"><a className="hover:text-ember-hi" href={waLink(t.wa.msg)}>{SITE.whatsappLabel}</a> · <a className="hover:text-ember-hi" href={`tel:${SITE.phone}`}>{SITE.phoneLabel}</a></p>
        </address>
        <div className="flex items-start gap-3 md:justify-end">
          {[
            { href: SITE.facebook, l: "Facebook", I: FacebookLogo },
            { href: SITE.instagram, l: "Instagram", I: InstagramLogo },
            { href: waLink(t.wa.msg), l: "WhatsApp", I: WhatsappLogo },
            { href: `tel:${SITE.phone}`, l: t.loc.call, I: Phone },
          ].map(({ href, l, I }) => (
            <a key={l} href={href} aria-label={l} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener" className="grid h-12 w-12 place-items-center rounded-full border border-line text-bone transition-colors hover:border-ember-hi hover:text-ember-hi"><I size={20} /></a>
          ))}
        </div>
      </div>
      <p aria-hidden className="display select-none whitespace-nowrap text-center text-[clamp(5rem,22vw,22rem)] leading-[.8] text-char">FOGO</p>
      <div className="wrap flex flex-wrap justify-between gap-4 border-t border-line py-6 pb-24 text-sm text-mute">
        <span>© {new Date().getFullYear()} Fogo de Chão Bolivia. {t.footer.rights}</span>
        <span className="flex gap-6">
          <Link href={`/${locale}/privacidad`} className="hover:text-ember-hi">{t.footer.privacy}</Link>
          <Link href={`/${locale}/terminos`} className="hover:text-ember-hi">{t.footer.terms}</Link>
        </span>
      </div>
    </footer>
  );
}
