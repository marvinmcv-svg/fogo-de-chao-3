# Fogo de Chão Bolivia

Premium rebuild of fogodechao.bo: Next.js (App Router) + Tailwind v4 + GSAP/ScrollTrigger + Lenis + Three.js, bilingual (ES/EN), with a Claude-powered AI receptionist, a WhatsApp widget, online reservations and an eClub sign-up.

## Run
```bash
cp .env.example .env.local   # fill in keys
npm install
npm run dev                  # http://localhost:3000 -> /es
npm run build && npm start
```

## Services you need to connect
| Feature | Env vars | Notes |
|---|---|---|
| AI receptionist | `ANTHROPIC_API_KEY`, optional `ANTHROPIC_MODEL` | Server only. Without a key the chat shows a friendly error and offers WhatsApp. |
| Reservations + eClub | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Apply `supabase/migrations/20261004000000_reservations.sql`. RLS is on with no policies: only the server (service role) reads or writes. |
| WhatsApp | `NEXT_PUBLIC_WHATSAPP` (default `59174621200`) | |

## Structure
- `app/[locale]/…` pages (`/es`, `/en`), `app/api/{chat,reserve,club}` routes.
- `components/sections/*` page sections; `components/receptionist`, `components/WhatsAppWidget.tsx`.
- `lib/motion/*` GSAP + Lenis layer (smooth scroll, split-text, parallax, magnetic); `components/EmberShader.tsx` raw WebGL hero shader; `components/three/EmberScene.tsx` 3D skewer + embers.
- `content/data.ts` menu, FAQ, story, gallery; `lib/i18n/dict.ts` UI strings; `lib/site.ts` contact, hours, open-now logic (Bolivia time).

## Before launch (needs the restaurant)
- Menu items are modeled on the Fogo de Chão format and carry **no prices**. Confirm dishes and add prices in `content/data.ts`.
- Imagery is stills taken from the restaurant's own brand videos. Replace with proper photography.
- Testimonials are labeled samples. Replace with real, attributed reviews.
- Privacy and Terms pages are placeholders for the official legal text.
- Map pin and `SITE.geo` are approximate.
- Rate limiting is in-memory (per instance). Use Upstash/Vercel KV for production scale.

## Motion and accessibility
Everything honors `prefers-reduced-motion` (no smooth scroll, pinning, shader or 3D). The 3D scene mounts only near the viewport and only if WebGL is available.
