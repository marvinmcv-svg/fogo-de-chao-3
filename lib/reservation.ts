import { z } from "zod";
import { bookingSlots } from "./site";

const slots = bookingSlots();
const todayBO = () => new Intl.DateTimeFormat("en-CA", { timeZone: "America/La_Paz" }).format(new Date());

export const reservationSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().regex(/^[+\d][\d\s()-]{5,22}$/),
  email: z.string().trim().email().max(120).optional().or(z.literal("")),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((d) => d >= todayBO(), "past"),
  time: z.string().refine((t) => slots.includes(t), "slot"),
  party_size: z.coerce.number().int().min(1).max(40),
  occasion: z.string().trim().max(60).optional(),
  notes: z.string().trim().max(500).optional(),
  locale: z.enum(["es", "en"]).default("es"),
  source: z.enum(["web", "ai"]).default("web"),
});
export type Reservation = z.infer<typeof reservationSchema>;
