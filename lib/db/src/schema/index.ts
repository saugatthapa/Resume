import { pgTable, text, timestamp, boolean, integer, jsonb, uuid } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  isAdmin: boolean("is_admin").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const sessionsTable = pgTable("sessions", {
  token: text("token").primaryKey(),
  userId: uuid("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
});

export const profilesTable = pgTable("profiles", {
  userId: uuid("user_id").primaryKey().references(() => usersTable.id, { onDelete: "cascade" }),
  plan: text("plan").notNull().default("free"),
  proUntil: timestamp("pro_until", { withTimezone: true }),
  downloadsToday: integer("downloads_today").notNull().default(0),
  downloadsResetAt: timestamp("downloads_reset_at", { withTimezone: true }).notNull().defaultNow(),
  coverLettersToday: integer("cover_letters_today").notNull().default(0),
});

export const resumesTable = pgTable("resumes", {
  userId: uuid("user_id").primaryKey().references(() => usersTable.id, { onDelete: "cascade" }),
  data: jsonb("data").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const coverLettersTable = pgTable("cover_letters", {
  userId: uuid("user_id").primaryKey().references(() => usersTable.id, { onDelete: "cascade" }),
  text: text("text").notNull().default(""),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const adminTemplatesTable = pgTable("admin_templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  html: text("html").notNull(),
  css: text("css").notNull(),
  createdBy: uuid("created_by").references(() => usersTable.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const paymentsTable = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  paypalOrderId: text("paypal_order_id").notNull().unique(),
  status: text("status").notNull(),
  amountUsd: text("amount_usd").notNull(),
  payerEmail: text("payer_email"),
  capturedAt: timestamp("captured_at", { withTimezone: true }),
  rawResponse: jsonb("raw_response"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const passwordResetTokensTable = pgTable("password_reset_tokens", {
  token: text("token").primaryKey(),
  userId: uuid("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  usedAt: timestamp("used_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type User = typeof usersTable.$inferSelect;
export type AdminTemplate = typeof adminTemplatesTable.$inferSelect;
export type Profile = typeof profilesTable.$inferSelect;
export type Payment = typeof paymentsTable.$inferSelect;

export const _sql = sql;
