import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";
import { db } from "./db";
import { sessionsTable, usersTable } from "./db/schema";
import { eq } from "drizzle-orm";

const SESSION_COOKIE = "rct_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30;

export type AuthedRequest = Request & {
  user?: typeof usersTable.$inferSelect;
  sessionToken?: string;
};

export async function hashPassword(p: string) {
  return bcrypt.hash(p, 10);
}
export async function verifyPassword(p: string, hash: string) {
  return bcrypt.compare(p, hash);
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await db.insert(sessionsTable).values({ token, userId, expiresAt });
  return { token, expiresAt };
}

export async function destroySession(token: string) {
  await db.delete(sessionsTable).where(eq(sessionsTable.token, token));
}

export function setSessionCookie(res: Response, token: string, expiresAt: Date) {
  const isProd = process.env.NODE_ENV === "production";
  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    expires: expiresAt,
    path: "/",
  });
}

export function clearSessionCookie(res: Response) {
  const isProd = process.env.NODE_ENV === "production";
  res.clearCookie(SESSION_COOKIE, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
  });
}

export async function loadUserFromCookie(req: AuthedRequest) {
  const token = (req as any).cookies?.[SESSION_COOKIE];
  if (!token) return;
  const rows = await db
    .select({ session: sessionsTable, user: usersTable })
    .from(sessionsTable)
    .innerJoin(usersTable, eq(usersTable.id, sessionsTable.userId))
    .where(eq(sessionsTable.token, token))
    .limit(1);
  const row = rows[0];
  if (!row) return;
  if (row.session.expiresAt.getTime() < Date.now()) {
    await destroySession(token);
    return;
  }
  req.user = row.user;
  req.sessionToken = token;
}

export function requireUser(req: AuthedRequest, res: Response, next: NextFunction) {
  if (!req.user) return res.status(401).json({ error: "Not authenticated" });
  next();
}

export function requireAdmin(req: AuthedRequest, res: Response, next: NextFunction) {
  if (!req.user) return res.status(401).json({ error: "Not authenticated" });
  if (!req.user.isAdmin) return res.status(403).json({ error: "Admins only" });
  next();
}
