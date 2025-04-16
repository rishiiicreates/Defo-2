import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Donation model to track user contributions
export const donations = pgTable("donations", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  amount: integer("amount").notNull(),
  name: text("name").notNull(),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Contact form submissions
export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Deforestation statistics
export const deforestationStats = pgTable("deforestation_stats", {
  id: serial("id").primaryKey(),
  region: text("region").notNull(),
  year: integer("year").notNull(),
  hectaresLost: integer("hectares_lost").notNull(),
  percentOfTotal: integer("percent_of_total").notNull()
});

// Schemas for inserts
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true
});

export const insertDonationSchema = createInsertSchema(donations).pick({
  email: true,
  amount: true,
  name: true,
  message: true
});

export const insertContactSubmissionSchema = createInsertSchema(contactSubmissions).pick({
  name: true,
  email: true,
  message: true
});

export const insertDeforestationStatSchema = createInsertSchema(deforestationStats).pick({
  region: true,
  year: true,
  hectaresLost: true,
  percentOfTotal: true
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertDonation = z.infer<typeof insertDonationSchema>;
export type Donation = typeof donations.$inferSelect;

export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;

export type InsertDeforestationStat = z.infer<typeof insertDeforestationStatSchema>;
export type DeforestationStat = typeof deforestationStats.$inferSelect;

// Solution action data
export interface SolutionAction {
  id: number;
  title: string;
  description: string;
  icon: string;
  actionText: string;
  actionLink: string;
}
