import express, { type Express } from "express";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "./db";
import {
  usersTable, profilesTable, resumesTable, coverLettersTable,
  adminTemplatesTable, paymentsTable, passwordResetTokensTable,
} from "@workspace/db/schema";
import {
  hashPassword, verifyPassword, createSession, destroySession,
  setSessionCookie, clearSessionCookie, loadUserFromCookie,
  requireUser, requireAdmin, type AuthedRequest,
} from "./auth";
import { createOrder, captureOrder, paypalClientId, paypalMode } from "./paypal";
import { ensureFreshProfile, EMPTY_RESUME } from "./util";
import { sendPasswordResetEmail } from "./email";
import { randomBytes } from "node:crypto";

export function createApp(): Express {
  const app = express();
  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser());

  const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use(generalLimiter);

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many attempts. Please try again in 15 minutes." },
  });

  app.use(async (req: AuthedRequest, _res, next) => {
    try { await loadUserFromCookie(req); } catch (e) { console.error("auth load error", e); }
    next();
  });

  // ---------- AUTH ----------
  const signupSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
  });
  app.post("/api/auth/signup", authLimiter, async (req, res) => {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
    const { name, email, password } = parsed.data;
    const existing = await db.select().from(usersTable).where(eq(usersTable.email, email.toLowerCase())).limit(1);
    if (existing[0]) return res.status(409).json({ error: "An account with that email already exists." });
    const passwordHash = await hashPassword(password);
    const [user] = await db.insert(usersTable).values({
      name: name.trim(), email: email.toLowerCase().trim(), passwordHash, isAdmin: false,
    }).returning();
    await db.insert(profilesTable).values({ userId: user.id });
    await db.insert(resumesTable).values({ userId: user.id, data: { ...EMPTY_RESUME, personal: { ...EMPTY_RESUME.personal, name: user.name, email: user.email } } });
    await db.insert(coverLettersTable).values({ userId: user.id, text: "" });
    const { token, expiresAt } = await createSession(user.id);
    setSessionCookie(res, token, expiresAt);
    res.json({ user: publicUser(user) });
  });

  app.post("/api/auth/login", authLimiter, async (req, res) => {
    const parsed = z.object({ email: z.string().email(), password: z.string().min(1) }).safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
    const rows = await db.select().from(usersTable).where(eq(usersTable.email, parsed.data.email.toLowerCase())).limit(1);
    const user = rows[0];
    if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
      return res.status(401).json({ error: "Email or password is incorrect." });
    }
    const { token, expiresAt } = await createSession(user.id);
    setSessionCookie(res, token, expiresAt);
    res.json({ user: publicUser(user) });
  });

  app.post("/api/auth/logout", async (req: AuthedRequest, res) => {
    if (req.sessionToken) await destroySession(req.sessionToken);
    clearSessionCookie(res);
    res.json({ ok: true });
  });

  app.get("/api/auth/me", async (req: AuthedRequest, res) => {
    if (!req.user) return res.json({ user: null, profile: null });
    const profile = await ensureFreshProfile(req.user.id);
    res.json({ user: publicUser(req.user), profile });
  });

  // ---------- PROFILE ----------
  app.post("/api/profile/record-download", requireUser, async (req: AuthedRequest, res) => {
    const p = await ensureFreshProfile(req.user!.id);
    const [updated] = await db.update(profilesTable)
      .set({ downloadsToday: p.downloadsToday + 1 })
      .where(eq(profilesTable.userId, req.user!.id)).returning();
    res.json({ profile: updated });
  });
  app.post("/api/profile/record-cover-letter", requireUser, async (req: AuthedRequest, res) => {
    const p = await ensureFreshProfile(req.user!.id);
    const [updated] = await db.update(profilesTable)
      .set({ coverLettersToday: p.coverLettersToday + 1 })
      .where(eq(profilesTable.userId, req.user!.id)).returning();
    res.json({ profile: updated });
  });
  app.post("/api/profile/downgrade", requireUser, async (req: AuthedRequest, res) => {
    const [updated] = await db.update(profilesTable)
      .set({ plan: "free", proUntil: null })
      .where(eq(profilesTable.userId, req.user!.id)).returning();
    res.json({ profile: updated });
  });
  // Demo-only admin toggle
  app.post("/api/profile/toggle-admin", requireUser, async (req: AuthedRequest, res) => {
    const [updated] = await db.update(usersTable)
      .set({ isAdmin: !req.user!.isAdmin })
      .where(eq(usersTable.id, req.user!.id)).returning();
    res.json({ user: publicUser(updated) });
  });

  // ---------- RESUME ----------
  app.get("/api/resume", requireUser, async (req: AuthedRequest, res) => {
    const rows = await db.select().from(resumesTable).where(eq(resumesTable.userId, req.user!.id)).limit(1);
    res.json({ resume: rows[0]?.data ?? null });
  });
  app.put("/api/resume", requireUser, async (req: AuthedRequest, res) => {
    const data = req.body?.resume;
    if (!data || typeof data !== "object") return res.status(400).json({ error: "Invalid resume payload" });
    await db.insert(resumesTable)
      .values({ userId: req.user!.id, data, updatedAt: new Date() })
      .onConflictDoUpdate({ target: resumesTable.userId, set: { data, updatedAt: new Date() } });
    res.json({ ok: true });
  });

  // ---------- COVER LETTER ----------
  app.get("/api/cover-letter", requireUser, async (req: AuthedRequest, res) => {
    const rows = await db.select().from(coverLettersTable).where(eq(coverLettersTable.userId, req.user!.id)).limit(1);
    res.json({ text: rows[0]?.text ?? "" });
  });
  app.put("/api/cover-letter", requireUser, async (req: AuthedRequest, res) => {
    const text = String(req.body?.text ?? "");
    await db.insert(coverLettersTable)
      .values({ userId: req.user!.id, text, updatedAt: new Date() })
      .onConflictDoUpdate({ target: coverLettersTable.userId, set: { text, updatedAt: new Date() } });
    res.json({ ok: true });
  });

  // ---------- ADMIN TEMPLATES ----------
  app.get("/api/admin/templates", async (_req, res) => {
    const list = await db.select().from(adminTemplatesTable).orderBy(adminTemplatesTable.createdAt);
    res.json({ templates: list });
  });
  app.get("/api/admin/templates/:id", async (req, res) => {
    const rows = await db.select().from(adminTemplatesTable).where(eq(adminTemplatesTable.id, req.params.id)).limit(1);
    if (!rows[0]) return res.status(404).json({ error: "Not found" });
    res.json({ template: rows[0] });
  });
  const tplSchema = z.object({
    name: z.string().min(1),
    description: z.string().default(""),
    html: z.string().min(1),
    css: z.string().default(""),
  });
  app.post("/api/admin/templates", requireAdmin, async (req: AuthedRequest, res) => {
    const parsed = tplSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
    const [tpl] = await db.insert(adminTemplatesTable).values({ ...parsed.data, createdBy: req.user!.id }).returning();
    res.json({ template: tpl });
  });
  app.put("/api/admin/templates/:id", requireAdmin, async (req, res) => {
    const parsed = tplSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
    const [tpl] = await db.update(adminTemplatesTable).set(parsed.data)
      .where(eq(adminTemplatesTable.id, req.params.id)).returning();
    if (!tpl) return res.status(404).json({ error: "Not found" });
    res.json({ template: tpl });
  });
  app.delete("/api/admin/templates/:id", requireAdmin, async (req, res) => {
    await db.delete(adminTemplatesTable).where(eq(adminTemplatesTable.id, req.params.id));
    res.json({ ok: true });
  });

  // ---------- PAYPAL ----------
  app.get("/api/paypal/config", (_req, res) => {
    res.json({ clientId: paypalClientId(), mode: paypalMode() });
  });
  app.post("/api/paypal/orders", requireUser, async (req: AuthedRequest, res) => {
    try {
      const order = await createOrder("5.00", "Resume & Career Tools — Pro plan (1 month)");
      await db.insert(paymentsTable).values({
        userId: req.user!.id,
        paypalOrderId: order.id,
        status: order.status,
        amountUsd: "5.00",
      });
      res.json({ orderId: order.id });
    } catch (e: any) {
      console.error("paypal createOrder", e);
      res.status(500).json({ error: e?.message ?? "Failed to create order" });
    }
  });
  app.post("/api/paypal/orders/:id/capture", requireUser, async (req: AuthedRequest, res) => {
    try {
      const result = await captureOrder(req.params.id);
      if (result.status !== "COMPLETED") {
        return res.status(400).json({ error: `Capture not completed: ${result.status}` });
      }
      await db.update(paymentsTable).set({
        status: "COMPLETED",
        capturedAt: new Date(),
        payerEmail: result.payer?.email_address ?? null,
        rawResponse: result as any,
      }).where(eq(paymentsTable.paypalOrderId, req.params.id));
      const proUntil = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
      await db.insert(profilesTable)
        .values({ userId: req.user!.id, plan: "pro", proUntil })
        .onConflictDoUpdate({ target: profilesTable.userId, set: { plan: "pro", proUntil } });
      const profile = await ensureFreshProfile(req.user!.id);
      res.json({ ok: true, profile });
    } catch (e: any) {
      console.error("paypal captureOrder", e);
      res.status(500).json({ error: e?.message ?? "Failed to capture order" });
    }
  });

  app.get("/api/healthz", (_req, res) => res.json({ ok: true }));

  // ---------- PASSWORD RESET ----------
  app.post("/api/auth/forgot-password", authLimiter, async (req, res) => {
    const email = String(req.body?.email ?? "").toLowerCase().trim();
    if (!email) return res.status(400).json({ error: "Email is required" });
    const rows = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
    if (!rows[0]) {
      return res.json({ ok: true });
    }
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60);
    await db.insert(passwordResetTokensTable).values({ token, userId: rows[0].id, expiresAt });
    await sendPasswordResetEmail(email, token);
    res.json({ ok: true });
  });

  app.post("/api/auth/reset-password", async (req, res) => {
    const { token, password } = req.body ?? {};
    if (!token || typeof token !== "string") return res.status(400).json({ error: "Token is required" });
    if (!password || typeof password !== "string" || password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }
    const rows = await db.select().from(passwordResetTokensTable).where(eq(passwordResetTokensTable.token, token)).limit(1);
    const record = rows[0];
    if (!record) return res.status(400).json({ error: "Invalid token" });
    if (record.expiresAt.getTime() < Date.now()) return res.status(400).json({ error: "Token expired" });
    if (record.usedAt) return res.status(400).json({ error: "Token already used" });
    await db.update(passwordResetTokensTable).set({ usedAt: new Date() }).where(eq(passwordResetTokensTable.token, token));
    const passwordHash = await hashPassword(password);
    await db.update(usersTable).set({ passwordHash }).where(eq(usersTable.id, record.userId));
    res.json({ ok: true });
  });

  // ---------- CRON: Expire Pro subscriptions ----------
  app.post("/api/cron/expire-pro", async (_req, res) => {
    if (process.env.CRON_SECRET && _req.headers["authorization"] !== `Bearer ${process.env.CRON_SECRET}`) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const now = new Date();
    const rows = await db.select().from(profilesTable).where(eq(profilesTable.plan, "pro"));
    let count = 0;
    for (const p of rows) {
      if (p.proUntil && new Date(p.proUntil).getTime() < now.getTime()) {
        await db.update(profilesTable).set({ plan: "free", proUntil: null }).where(eq(profilesTable.userId, p.userId));
        count++;
      }
    }
    res.json({ ok: true, expired: count });
  });

  return app;
}

function publicUser(u: typeof usersTable.$inferSelect) {
  return { id: u.id, email: u.email, name: u.name, isAdmin: u.isAdmin, createdAt: u.createdAt };
}
