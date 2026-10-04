import { dicts } from "@/lib/i18n/dict";
import { SITE, type Locale } from "@/lib/site";
import { faq } from "@/content/data";
import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import Churrasco from "@/components/sections/Churrasco";
import Scene from "@/components/sections/Scene";
import Bento from "@/components/sections/Bento";
import Menu from "@/components/sections/Menu";
import Story from "@/components/sections/Story";
import Gallery from "@/components/sections/Gallery";
import Events from "@/components/sections/Events";
import GiftClub from "@/components/sections/GiftClub";
import Voices from "@/components/sections/Voices";
import Reserve from "@/components/sections/Reserve";
import Location from "@/components/sections/Location";
import Faq from "@/components/sections/Faq";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  const t = dicts[locale];
  const jsonLd = [
    {
      "@context": "https://schema.org", "@type": "Restaurant", name: SITE.name, url: SITE.url, servesCuisine: ["Brazilian", "Steakhouse", "Churrasco"],
      priceRange: "$$$", telephone: SITE.phone, image: `${SITE.url}/img/hero-1.webp`, hasMenu: `${SITE.url}/${locale}/menu`, acceptsReservations: true,
      address: { "@type": "PostalAddress", streetAddress: "Ventura Mall, Av. 4to Anillo esq. Av. San Martín", addressLocality: "Santa Cruz de la Sierra", addressCountry: "BO" },
      geo: { "@type": "GeoCoordinates", latitude: SITE.geo.lat, longitude: SITE.geo.lng },
      openingHoursSpecification: [
        { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], opens: "11:30", closes: "16:00" },
        { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], opens: "19:00", closes: "23:00" },
      ],
      sameAs: [SITE.facebook, SITE.instagram],
    },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q[locale], acceptedAnswer: { "@type": "Answer", text: f.a[locale] } })) },
  ];
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Hero t={t} locale={locale} />
      <Marquee locale={locale} />
      <Churrasco t={t} />
      <Scene t={t} />
      <Bento t={t} />
      <Menu t={t} locale={locale} />
      <Story t={t} locale={locale} />
      <Gallery t={t} locale={locale} />
      <Events t={t} locale={locale} />
      <GiftClub t={t} locale={locale} />
      <Voices t={t} locale={locale} />
      <Reserve t={t} locale={locale} />
      <Location t={t} />
      <Faq t={t} locale={locale} />
    </>
  );
}
