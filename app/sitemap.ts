import type { MetadataRoute } from "next";
import { SITE, LOCALES } from "@/lib/site";

const pages = ["", "/menu", "/historia", "/ubicacion", "/reservas", "/contacto"];
export default function sitemap(): MetadataRoute.Sitemap {
  return LOCALES.flatMap((l) => pages.map((p) => ({ url: `${SITE.url}/${l}${p}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7 })));
}
