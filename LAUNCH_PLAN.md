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

## Deploy to Vercel

### Step 1: Push to GitHub
Run this in terminal:
```bash
git push origin main
```
If the push fails, use GitHub Desktop or VS Code to push.

### Step 2: Create Vercel Project
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repo: `saugatthapa/Resume`
3. Framework: **Vercel** (or None)
4. Build Command: leave default
5. Output Directory: `artifacts/resume-tools/dist/public`

### Step 3: Add Environment Variables
In Vercel project Settings → Environment Variables:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | From Vercel Postgres |
| `PAYPAL_CLIENT_ID` | From PayPal Developer Dashboard |
| `PAYPAL_CLIENT_SECRET` | From PayPal Developer Dashboard |
| `PAYPAL_MODE` | `sandbox` (or `live`) |
| `RESEND_API_KEY` | From Resend.com |
| `CRON_SECRET` | Generate with: `openssl rand -hex 32` |
| `APP_URL` | Your Vercel URL (e.g., `https://your-app.vercel.app`) |
| `VITE_PLAUSIBLE_DOMAIN` | Your Plausible domain (optional) |

### Step 4: Provision Vercel Postgres
1. Go to Storage → Create Database → Postgres
2. Copy the `DATABASE_URL` to Vercel env vars
3. Run schema push in Vercel CLI or connect via pg:

```bash
vercel env pull .env.local
pnpm --filter @workspace/db push
```

### Step 5: Set Up Cron
The cron is already configured in `vercel.json` to run daily at midnight.
Vercel will automatically create the cron job on deploy.

### Step 6: Deploy
Click **Deploy** — Vercel will build and deploy automatically on every push to `main`.

---

## After Deploy Checklist

- [ ] Verify `/api/healthz` returns `{ok: true}`
- [ ] Sign up and test account creation
- [ ] Test password reset email (check if Resend works)
- [ ] Complete a PayPal test payment
- [ ] Download a PDF resume
- [ ] Check Vercel Postgres data in dashboard