import { SITE, waLink } from "./site";

type Msg = { role: "user" | "assistant"; content: string };
const json = (o: unknown, status = 200) => new Response(JSON.stringify(o), { status, headers: { "content-type": "application/json" } });

export async function mockApi(path: string, init: RequestInit): Promise<Response> {
  await new Promise((r) => setTimeout(r, 350));
  if (path.endsWith("/api/reserve") || path.endsWith("/api/club")) return json({ ok: true });
  if (path.endsWith("/api/chat")) {
    const body = JSON.parse(String(init.body)) as { locale: "es" | "en"; messages: Msg[] };
    return stream(reply(body.locale, body.messages));
  }
  return json({ error: "not_found" }, 404);
}

function stream({ text, wa }: { text: string; wa?: string }) {
  const enc = new TextEncoder();
  const words = text.split(/(\s+)/);
  return new Response(
    new ReadableStream({
      async start(c) {
        for (const w of words) {
          c.enqueue(enc.encode(JSON.stringify({ t: "text", v: w }) + "\n"));
          await new Promise((r) => setTimeout(r, 28));
        }
        if (wa) c.enqueue(enc.encode(JSON.stringify({ t: "wa", url: wa }) + "\n"));
        c.enqueue(enc.encode(JSON.stringify({ t: "done" }) + "\n"));
        c.close();
      },
    }),
    { headers: { "content-type": "application/x-ndjson" } },
  );
}

const T = {
  es: {
    hours: "Abrimos todos los días: almuerzo de 11:30 a 16:00 y cena de 19:00 a 23:00.",
    veg: "Sí. La Market Table tiene ensaladas, verduras, quesos y panes. Si tienes alguna alergia, escríbenos por WhatsApp y lo coordinamos con la cocina.",
    where: `Estamos en ${SITE.address}.`,
    menu: "Servimos rodízio: cortes asados al fuego en tu mesa (picanha, filet mignon, fraldinha, cordero y más), Market Table, Bar Fogo con caipirinhas y vinos, y postres. Para precios, consulta por WhatsApp.",
    book: "Con gusto. Dime tu nombre, la fecha, la hora y para cuántas personas, y preparo la solicitud.",
    booked: "Listo, tengo tu solicitud. El equipo la confirma por WhatsApp; toca el botón para enviarla.",
    fallback: "No tengo ese dato. Para eso, lo mejor es hablar con una persona del equipo por WhatsApp.",
    demo: " (Modo demo: respuestas de ejemplo, no es la IA real.)",
    waMsg: "Hola, quisiera confirmar una reserva en Fogo de Chão.",
  },
  en: {
    hours: "We are open every day: lunch 11:30 to 16:00 and dinner 19:00 to 23:00.",
    veg: "Yes. The Market Table has salads, vegetables, cheeses and breads. For any allergy, message us on WhatsApp and we will coordinate with the kitchen.",
    where: `We are at ${SITE.address}.`,
    menu: "We serve rodízio: fire-roasted cuts carved at your table (picanha, filet mignon, fraldinha, lamb and more), the Market Table, Bar Fogo with caipirinhas and wines, and desserts. For prices, ask on WhatsApp.",
    book: "Happy to. Tell me your name, the date, the time and how many guests, and I will prepare the request.",
    booked: "Done, I have your request. The team confirms it on WhatsApp; tap the button to send it.",
    fallback: "I do not have that detail. The best option is to talk to a team member on WhatsApp.",
    demo: " (Demo mode: sample replies, not the real AI.)",
    waMsg: "Hello, I would like to confirm a reservation at Fogo de Chão.",
  },
};

function reply(locale: "es" | "en", msgs: Msg[]): { text: string; wa?: string } {
  const t = T[locale];
  const last = msgs[msgs.length - 1]?.content.toLowerCase() ?? "";
  const prevBot = [...msgs].reverse().find((m) => m.role === "assistant")?.content ?? "";
  const first = msgs.filter((m) => m.role === "user").length === 1;
  const suffix = first ? t.demo : "";
  const askedBooking = prevBot.startsWith(t.book.slice(0, 20));
  if (askedBooking && /\d/.test(last)) return { text: t.booked, wa: waLink(t.waMsg + " " + msgs[msgs.length - 1].content) };
  if (/(reserv|book|mesa|table)/.test(last)) return { text: t.book + suffix };
  if (/(horari|hora|hours|open|abren|abierto)/.test(last)) return { text: t.hours + suffix };
  if (/(vegetar|vegan|alerg|allerg)/.test(last)) return { text: t.veg + suffix };
  if (/(donde|dónde|ubic|where|address|direcci|location)/.test(last)) return { text: t.where + suffix };
  if (/(menu|menú|carta|comida|food|price|precio)/.test(last)) return { text: t.menu + suffix };
  return { text: t.fallback + suffix, wa: waLink(t.waMsg) };
}
