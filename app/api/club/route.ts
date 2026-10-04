import { NextResponse } from "next/server";
import { z } from "zod";
import { db, limited, clientIp } from "@/lib/server";

const schema = z.object({ email: z.string().trim().email().max(120), locale: z.enum(["es", "en"]).default("es") });

export async function POST(req: Request) {
  if (limited(`club:${clientIp(req)}`, 5, 10 * 60_000)) return NextResponse.json({ error: "rate" }, { status: 429 });
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });
  const supa = db();
  if (!supa) return NextResponse.json({ error: "not_configured" }, { status: 503 });
  const { error } = await supa.from("club_subscribers").upsert(parsed.data, { onConflict: "email" });
  if (error) return NextResponse.json({ error: "db" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
