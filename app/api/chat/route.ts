import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { systemPrompt, tools } from "@/lib/receptionist";
import { reservationSchema } from "@/lib/reservation";
import { db, limited, clientIp } from "@/lib/server";
import { waLink } from "@/lib/site";

export const runtime = "nodejs";
export const maxDuration = 60;

const body = z.object({
  locale: z.enum(["es", "en"]).default("es"),
  messages: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().min(1).max(1200) })).min(1).max(24),
});

const line = (o: unknown) => new TextEncoder().encode(JSON.stringify(o) + "\n");

export async function POST(req: Request) {
  if (limited(`chat:${clientIp(req)}`, 25, 10 * 60_000)) return Response.json({ error: "rate" }, { status: 429 });
  const parsed = body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "invalid" }, { status: 400 });
  if (!process.env.ANTHROPIC_API_KEY) return Response.json({ error: "not_configured" }, { status: 503 });

  const client = new Anthropic();
  const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5";
  const { locale } = parsed.data;
  const history: Anthropic.MessageParam[] = parsed.data.messages;

  const stream = new ReadableStream({
    async start(ctrl) {
      const send = (o: unknown) => ctrl.enqueue(line(o));
      try {
        for (let turn = 0; turn < 4; turn++) {
          const s = client.messages.stream({ model, max_tokens: 700, system: systemPrompt(), tools, messages: history });
          s.on("text", (d) => send({ t: "text", v: d }));
          const msg = await s.finalMessage();
          if (msg.stop_reason !== "tool_use") break;

          history.push({ role: "assistant", content: msg.content });
          const results: Anthropic.ToolResultBlockParam[] = [];
          for (const block of msg.content) {
            if (block.type !== "tool_use") continue;
            results.push({ type: "tool_result", tool_use_id: block.id, ...(await runTool(block.name, block.input, locale, send)) });
          }
          history.push({ role: "user", content: results });
        }
        send({ t: "done" });
      } catch (e) {
        console.error("chat error", e);
        send({ t: "error" });
      } finally {
        ctrl.close();
      }
    },
  });
  return new Response(stream, { headers: { "content-type": "application/x-ndjson; charset=utf-8", "cache-control": "no-store" } });
}

async function runTool(name: string, input: unknown, locale: "es" | "en", send: (o: unknown) => void) {
  if (name !== "create_reservation") return { content: "Unknown tool", is_error: true };
  const r = reservationSchema.safeParse({ ...(input as object), locale, source: "ai" });
  if (!r.success) return { content: `Invalid reservation: ${JSON.stringify(r.error.flatten().fieldErrors)}. Ask the guest to correct it.`, is_error: true };
  if (r.data.party_size > 10) return { content: "Groups over 10 must be arranged by a human on WhatsApp. Do not save; tell the guest.", is_error: true };

  const wa = waLink(
    locale === "es"
      ? `Hola, soy ${r.data.name}. Quisiera confirmar una reserva para ${r.data.party_size} personas el ${r.data.date} a las ${r.data.time}.`
      : `Hello, I am ${r.data.name}. I would like to confirm a reservation for ${r.data.party_size} guests on ${r.data.date} at ${r.data.time}.`,
  );
  const supa = db();
  if (!supa) {
    send({ t: "wa", url: wa });
    return { content: "Booking system is offline. The guest can confirm directly on WhatsApp (link shown in the chat). Tell them so; do not claim it was saved.", is_error: true };
  }
  const { email, ...rest } = r.data;
  const { error } = await supa.from("reservations").insert({ ...rest, email: email || null });
  if (error) {
    send({ t: "wa", url: wa });
    return { content: "Could not save. Guest can confirm on WhatsApp (link shown). Do not claim it was saved.", is_error: true };
  }
  send({ t: "wa", url: wa });
  return { content: "Reservation request saved as pending. The team will confirm on WhatsApp; a WhatsApp button is shown to the guest." };
}
