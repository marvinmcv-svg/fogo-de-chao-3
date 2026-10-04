import { NextResponse } from "next/server";
import { reservationSchema } from "@/lib/reservation";
import { db, limited, clientIp } from "@/lib/server";

export async function POST(req: Request) {
  if (limited(`res:${clientIp(req)}`, 6, 10 * 60_000)) return NextResponse.json({ error: "rate" }, { status: 429 });
  const parsed = reservationSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid", issues: parsed.error.flatten().fieldErrors }, { status: 400 });
  const supa = db();
  if (!supa) return NextResponse.json({ error: "not_configured" }, { status: 503 });
  const { email, ...rest } = parsed.data;
  const { error } = await supa.from("reservations").insert({ ...rest, email: email || null, source: "web" });
  if (error) return NextResponse.json({ error: "db" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
