# Resume & Career Tools

A freemium SaaS web app for building resumes, writing cover letters, and polishing
your professional brand. Frontend-only (React + Vite), backed entirely by
localStorage — no backend, no API hooks, no codegen.

## Stack

- React + Vite + TypeScript
- Tailwind v4 with shadcn-style UI primitives (`src/components/ui/*`)
- wouter (router)
- react-helmet-async (per-page SEO + OG tags)
- jspdf + html2canvas (PDF export)

## Brand & design

- Warm cream background (`hsl 36 38% 97%`), deep forest green primary
  (`hsl 158 42% 26%`), terracotta accent (`hsl 16 64% 56%`).
- Fraunces serif for headings, Inter sans for body.
- No emojis anywhere in the UI.

## Routes

Marketing (public):
- `/` Landing
- `/pricing`
- `/login`, `/signup`
- `/resume-summary-generator`, `/cover-letter-generator-free`,
  `/resume-headline-generator`, `/skills-for-resume-generator` — SEO landing
  pages with embedded mini-tools and 300–500 words of real career advice.

App (mock auth — redirects to `/login` if no session):
- `/dashboard`
- `/dashboard/resume` — multi-step builder + live preview + PDF export
- `/dashboard/cover-letter`
- `/dashboard/ai-tools`
- `/dashboard/settings`

## localStorage keys

- `rct.users` — array of mock users
- `rct.session` — `{ userId, email } | null`
- `rct.profile.<userId>` — `{ plan, downloadsToday, downloadsResetAt, coverLettersToday }`
- `rct.resume.<userId>` — full resume document
- `rct.coverLetter.<userId>` — last generated cover letter text

Daily counters auto-reset on profile fetch when `downloadsResetAt` falls behind today.

## Free vs Pro

Free:
- Classic template only
- 2 PDF downloads / day, 3 cover letters / day
- Watermark on exported PDFs
- "Upgrade for advanced suggestions" footer in AI tools

Pro ($5/mo, simulated upgrade):
- All 3 templates (Classic, Modern, Minimal)
- Unlimited downloads + cover letters
- No watermark
- Slightly richer AI summaries

Upgrades are UI-only — `Profiles.upgrade(userId)` flips a localStorage flag.

## Key files

- `src/lib/storage.ts` — localStorage models + daily-reset logic
- `src/lib/auth.tsx` — mock signup/login + AuthProvider
- `src/lib/ai.ts` — deterministic summary / headline / cover letter / skills generators
- `src/lib/pdf.ts` — html2canvas → jsPDF, with watermark for free users
- `src/components/ResumePreview.tsx` — Classic / Modern / Minimal templates
- `src/components/AppShell.tsx`, `MarketingShell.tsx` — layouts
- `src/components/UpgradeModal.tsx` — upgrade flow modal
- `src/pages/ResumeBuilder.tsx` — main builder (steps + autosave + export)
