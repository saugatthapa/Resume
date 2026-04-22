import { profilesTable } from "./db/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export function startOfDay(d = new Date()) {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
}

export async function ensureFreshProfile(userId: string) {
  const rows = await db.select().from(profilesTable).where(eq(profilesTable.userId, userId)).limit(1);
  let p = rows[0];
  if (!p) {
    [p] = await db.insert(profilesTable).values({ userId, downloadsResetAt: startOfDay() }).returning();
  }
  const today = startOfDay();
  if (new Date(p.downloadsResetAt).getTime() !== today.getTime()) {
    [p] = await db
      .update(profilesTable)
      .set({ downloadsResetAt: today, downloadsToday: 0, coverLettersToday: 0 })
      .where(eq(profilesTable.userId, userId))
      .returning();
  }
  // Auto-downgrade if proUntil expired
  if (p.plan === "pro" && p.proUntil && new Date(p.proUntil).getTime() < Date.now()) {
    [p] = await db
      .update(profilesTable)
      .set({ plan: "free", proUntil: null })
      .where(eq(profilesTable.userId, userId))
      .returning();
  }
  return p;
}

export const EMPTY_RESUME = {
  template: "classic" as const,
  personal: { name: "", email: "", phone: "", location: "", website: "" },
  summary: "",
  skills: [] as string[],
  experience: [] as any[],
  education: [] as any[],
};
