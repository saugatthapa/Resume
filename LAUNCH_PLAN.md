# Launch Plan - Resume & Career Tools

## Status: NEARLY LAUNCH READY

Most critical gaps have been fixed.

---

## Completed

### 1. Legal Pages
- [x] Privacy Policy page (`/privacy-policy`)
- [x] Terms of Service page (`/terms-of-service`)
- [x] Links in footer and pricing page

### 2. Fake Social Proof Removed
- [x] Removed "Trusted by 12,000+ job seekers"
- [x] Removed "4.9 / 5 from over 2,400 reviews"

### 3. Email Service
- [x] Resend integration (`server/email.ts`)
- [x] Password reset API (`/api/auth/forgot-password`, `/api/auth/reset-password`)
- [x] Forgot password page (`/forgot-password`)
- [x] Reset password page (`/reset-password`)
- [x] Password reset token table (`password_reset_tokens`)

### 4. Rate Limiting
- [x] General rate limiter (200 req/15 min)
- [x] Auth rate limiter (10 req/15 min)

### 5. Watermark
- [x] Already implemented on free tier PDFs

### 6. Analytics
- [x] Plausible integration ready (set `VITE_PLAUSIBLE_DOMAIN`)

### 7. Pro Expiration
- [x] Cron endpoint `/api/cron/expire-pro` (set up Vercel cron)

### 8. Env Template
- [x] Created `.env.example`

---

## Remaining (Not Critical for Launch)

- Email verification on signup
- Real AI integration (OpenAI/Anthropic)
- CSRF protection
- `.env` with real keys to deploy

---

## Deploy Checklist

1. [ ] Set up Resend account + add `RESEND_API_KEY`
2. [ ] Set up PayPal app + add `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`
3. [ ] Set up Plausible analytics + add `VITE_PLAUSIBLE_DOMAIN`
4. [ ] Push schema: `pnpm --filter @workspace/db push`
5. [ ] Add Vercel cron: daily check for Pro expiration
6. [ ] Add to footer: actual contact email