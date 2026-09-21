# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # start dev server (Next.js 16 with Turbopack)
npm run build    # production build — also type-checks via tsc
npm run lint     # ESLint (Next.js config)
```

No test suite is configured. Type errors surface during `npm run build`.

## Architecture

### Stack
Next.js 16.3 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion · Lenis (smooth scroll)

### Backend proxy pattern
The browser **never calls the fleet backend directly**. All fleet/auth API calls go through Next.js Route Handlers in `app/api/` which proxy to `http://34.166.167.2` (overridable via `FLEET_API_BASE_URL` env var).

`lib/fleetHttp.ts` is the low-level HTTP helper used by all route handlers. On Windows it falls back from `fetch` to `curl.exe` when Node gets `EACCES` on port 80 — do not remove the curl fallback.

`lib/fleetApi.ts` is the **server-side** typed client (used only inside route handlers). It unwraps the fleet API envelope `{ success, data, timestamp }`. Note: the live API returns camelCase field names (`className`, `baseFare`) but the Swagger docs show snake_case — trust `lib/fleetApi.ts` types over the docs.

### Booking flow
The single large component `components/AirportTransferBookingDialog.tsx` handles all 5 service types (`airport | hourly | city | day | oneWay`) in a 4-step dialog (trip details → vehicle selection → review → fare + submit).

- **Unauthenticated / manual booking**: submits to `POST /api/bookings/manual` → proxied to `POST /api/v1/public/bookings/manual-booking`. Customer identity (`name`, `email`, `phone`) sent inline.
- **Authenticated booking** (to be built): uses `POST /api/v1/bookings` with `Authorization: Bearer <token>`, then `GET /api/v1/bookings/payment/initiate` for the Paymob checkout URL.

Auth session (`accessToken` + `refreshToken`) is stored in `localStorage` under key `whiteline.customerSession`. OTP login is embedded inside the booking dialog's step 0 (`BookingForSection`). Only Saudi numbers (`/^\+966\d{9}$/`) are accepted.

### i18n / RTL
All UI strings live in `lib/i18n.ts` as a single `translations` object with `en` and `ar` keys. `context/LanguageContext.tsx` provides `useLanguage()` → `{ trans, dir, lang, setLang }`. Direction is synced to `<html dir>` automatically. When adding any new user-facing string, add it to both `en` and `ar` blocks in `lib/i18n.ts`.

### Fleet image proxying
Vehicle images from the fleet backend reference `localhost` URLs. `lib/fleetApi.ts` rewrites these to `/api/fleet/image?url=...` which is served by `app/api/fleet/image/route.ts`. Always go through this proxy — don't expose the raw backend URL to the browser.

### Temp fleet images
`components/AirportTransferBookingDialog.tsx` maintains a `TEMP_FLEET_IMAGES` map of local PNGs in `/public/temp_fleet_cars/` as a fallback when `vehicle.vehicle_front_photo_url` is null. Once the backend reliably returns photos, this can be removed.

### Environment variables
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY   # Places autocomplete in booking dialog
FLEET_API_BASE_URL                # Defaults to http://34.166.167.2
PAYMOB_BASE_URL                   # https://ksa.paymob.com
PAYMOB_SECRET_KEY
PAYMOB_PUBLIC_KEY
PAYMOB_PAYMENT_METHODS
```
