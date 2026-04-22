# Resume & Career Tools

Freemium SaaS (Free $0 vs Pro $5/mo) with resume builder (3 templates + admin-uploaded premium templates + PDF export), cover letter generator, AI tools, SEO landing pages, and an admin panel.

## Stack

- **Frontend**: Vite + React + TypeScript + Tailwind + shadcn/ui (`artifacts/resume-tools/src`)
- **Backend**: Express (cookie sessions + bcrypt) under `artifacts/resume-tools/server`
- **DB**: Postgres via Drizzle ORM. Schema lives at `lib/db/src/schema/index.ts`. Run `pnpm --filter @workspace/db push` to sync.
- **Payments**: Real PayPal — `@paypal/react-paypal-js` on the client, `@paypal/checkout-server-sdk` on the server. `$5.00 USD` one-time → 30 days of Pro. `PAYPAL_MODE=live` flips from sandbox to production.
- **Dev**: Vite + Express run together via `concurrently` (`pnpm --filter @workspace/resume-tools run dev`). Vite proxies `/api` → `localhost:5174`.
- **Vercel**: `artifacts/resume-tools/api/[...path].ts` wraps the Express app as a serverless function; `vercel.json` rewrites `/api/(.*)` to it. The Vite build is the static frontend.

## Routes

Public: `/`, `/pricing`, `/summary-tool`, `/cover-letter-generator`, `/headline-generator`, `/skills-generator`, `/login`, `/signup`.

Authed: `/dashboard`, `/dashboard/resume`, `/dashboard/cover-letter`, `/dashboard/ai-tools`, `/dashboard/settings`, `/dashboard/admin/templates` (admin only).

## API (Express)

- `POST /api/auth/signup`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`
- `POST /api/profile/record-download`, `POST /api/profile/record-cover-letter`, `POST /api/profile/downgrade`, `POST /api/profile/toggle-admin`
- `GET /api/resume`, `PUT /api/resume`
- `GET /api/cover-letter`, `PUT /api/cover-letter`
- `GET /api/admin/templates`, `POST /api/admin/templates`, `PUT /api/admin/templates/:id`, `DELETE /api/admin/templates/:id` (admin only)
- `GET /api/paypal/config`, `POST /api/paypal/orders`, `POST /api/paypal/orders/:id/capture`

Session cookie: `rct_session`, httpOnly, 30d TTL. In production: `secure` + `sameSite=none`.

## Free vs Pro

Free: Classic template only · 2 PDF downloads/day · 3 cover letters/day · watermark on PDFs.
Pro ($5 / 30 days): all 3 templates + admin premium templates · unlimited downloads + cover letters · no watermark · richer AI suggestions.

Plan auto-downgrades to Free in `ensureFreshProfile` once `proUntil < now`.

## Required environment variables

Local dev (.env at repo root or `artifacts/resume-tools/.env`):
- `DATABASE_URL` — Postgres connection string (provided by Replit)
- `SESSION_SECRET` — random 32+ char string
- `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET` — PayPal app credentials
- `PAYPAL_MODE` — `sandbox` (default) or `live`

Vercel deployment (set under Project → Settings → Environment Variables):
- `DATABASE_URL`
- `SESSION_SECRET`
- `PAYPAL_CLIENT_ID`
- `PAYPAL_CLIENT_SECRET`
- `PAYPAL_MODE` = `live` for production
- `NODE_ENV` = `production` (Vercel sets this automatically)

## Key files

- `lib/db/src/schema/index.ts` — Drizzle schema (users, sessions, profiles, resumes, coverLetters, adminTemplates, payments)
- `artifacts/resume-tools/server/app.ts` — Express routes
- `artifacts/resume-tools/server/auth.ts` — bcrypt + cookie session middleware
- `artifacts/resume-tools/server/paypal.ts` — PayPal SDK client + create/capture helpers
- `artifacts/resume-tools/server/dev.ts` — local dev server entry (port 5174)
- `artifacts/resume-tools/api/[...path].ts` — Vercel serverless wrapper
- `artifacts/resume-tools/vercel.json` — Vercel rewrites
- `artifacts/resume-tools/src/lib/storage.ts` — typed `fetch` API client (Auth, ProfileApi, ResumeApi, CoverLetterApi, AdminTemplatesApi, PayPalApi)
- `artifacts/resume-tools/src/lib/auth.tsx` — async `AuthProvider` backed by `/api/auth/*`
- `artifacts/resume-tools/src/components/UpgradeModal.tsx` — real PayPal Buttons (PayPal balance + Credit/Debit cards via card funding)
- `artifacts/resume-tools/src/components/ResumePreview.tsx` — Classic / Modern / Minimal + admin custom templates (passed as a prop)
- `artifacts/resume-tools/src/pages/ResumeBuilder.tsx` — main builder, async load + debounced autosave
- `artifacts/resume-tools/src/pages/AdminTemplates.tsx` — admin CRUD over `/api/admin/templates`

## Design

- Palette: forest green (#1F4D3F), terracotta accent, cream paper. PayPal blue (#003087 / #0070BA) on checkout.
- Type: Fraunces (serif headings) + Inter (UI).
- No emojis in UI copy.
