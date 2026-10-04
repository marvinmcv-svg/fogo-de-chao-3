export const SITE = {
  name: "Fogo de Chão Bolivia",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://fogodechao.bo",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "59174621200",
  whatsappLabel: "+591 746-21200",
  phone: "+59134023155",
  phoneLabel: "402-3155",
  facebook: "https://www.facebook.com/FogoBolivia",
  instagram: "https://www.instagram.com/fogodechao.bo/",
  address: "Ventura Mall, Av. 4to Anillo esq. Av. San Martín S/N, Santa Cruz de la Sierra",
  tz: "America/La_Paz",
  // Santa Cruz de la Sierra, Ventura Mall (approximate; replace with exact pin)
  geo: { lat: -17.7712, lng: -63.1887 },
  // Every day: lunch and dinner service, in minutes from midnight
  services: [
    { key: "lunch", from: 11 * 60 + 30, to: 16 * 60 },
    { key: "dinner", from: 19 * 60, to: 23 * 60 },
  ],
} as const;

export const LOCALES = ["es", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const isLocale = (v: string): v is Locale => (LOCALES as readonly string[]).includes(v);

export function waLink(text: string) {
  return `https://api.whatsapp.com/send?phone=${SITE.whatsapp}&text=${encodeURIComponent(text)}`;
}

/** Slots offered in the booking form, 30-minute steps inside service windows. */
export function bookingSlots(): string[] {
  const out: string[] = [];
  for (const s of SITE.services) {
    // last seating 60 min before close
    for (let m = s.from; m <= s.to - 60; m += 30) {
      out.push(`${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`);
    }
  }
  return out;
}

/** Open-now in Bolivia time, independent of the visitor's timezone. */
export function openStatus(now = new Date()): { open: boolean; nextLabel: { es: string; en: string } } {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: SITE.tz,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const h = Number(parts.find((p) => p.type === "hour")?.value ?? 0) % 24;
  const m = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  const mins = h * 60 + m;
  const fmt = (t: number) => `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
  for (const s of SITE.services) {
    if (mins >= s.from && mins < s.to) {
      return { open: true, nextLabel: { es: `Abierto hasta las ${fmt(s.to)}`, en: `Open until ${fmt(s.to)}` } };
    }
  }
  const next = SITE.services.find((s) => mins < s.from) ?? SITE.services[0];
  return { open: false, nextLabel: { es: `Abre a las ${fmt(next.from)}`, en: `Opens at ${fmt(next.from)}` } };
}
