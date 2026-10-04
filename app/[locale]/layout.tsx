import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { LOCALES, SITE, isLocale, type Locale } from "@/lib/site";
import { dicts } from "@/lib/i18n/dict";
import SmoothScroll from "@/lib/motion/SmoothScroll";
import Cursor from "@/components/Cursor";
import Preloader from "@/components/Preloader";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Receptionist from "@/components/receptionist/Receptionist";
import WhatsAppWidget from "@/components/WhatsAppWidget";

export const dynamicParams = false;
export const generateStaticParams = () => LOCALES.map((locale) => ({ locale }));

export const viewport: Viewport = { themeColor: "#0c0b0a", width: "device-width", initialScale: 1 };

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const es = locale === "es";
  const title = es ? "Fogo de Chão Bolivia · Churrasco brasileño en Santa Cruz" : "Fogo de Chão Bolivia · Brazilian churrasco in Santa Cruz";
  const description = es
    ? "Rodízio brasileño con cortes asados al fuego y servidos en tu mesa. Ventura Mall, Santa Cruz. Reserva en línea o por WhatsApp."
    : "Brazilian rodízio with fire-roasted cuts carved at your table. Ventura Mall, Santa Cruz. Book online or on WhatsApp.";
  return {
    metadataBase: new URL(SITE.url),
    title: { default: title, template: "%s · Fogo de Chão Bolivia" },
    description,
    alternates: { canonical: `/${locale}`, languages: { es: "/es", en: "/en" } },
    openGraph: { title, description, type: "website", locale: es ? "es_BO" : "en_US", siteName: SITE.name, images: [{ url: "/img/hero-1.webp", width: 1280, height: 720 }] },
    twitter: { card: "summary_large_image", title, description },
    icons: { icon: "/media/logo.webp" },
  };
}

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = dicts[locale as Locale];
  return (
    <html lang={locale}>
      <body>
        <SmoothScroll />
        <Cursor />
        <Preloader />
        <Nav locale={locale} t={t} />
        <main id="main">{children}</main>
        <Footer locale={locale} t={t} />
        <WhatsAppWidget t={t} />
        <Receptionist locale={locale} t={t} />
      </body>
    </html>
  );
}
