import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  title: text("title").notNull(),
  bio: text("bio"),
  experienceLevel: text("experience_level").notNull(), // "beginner", "intermediate", "professional"
  skills: text("skills").array().default([]),
  profileImage: text("profile_image"),
  isOnline: boolean("is_online").default(false),
  openToCollaborate: boolean("open_to_collaborate").default(true),
  lastSeen: timestamp("last_seen"),
});

export const connections = pgTable("connections", {
  id: serial("id").primaryKey(),
  requesterId: integer("requester_id").notNull(),
  receiverId: integer("receiver_id").notNull(),
  status: text("status").notNull(), // "pending", "accepted", "declined"
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").notNull(),
  receiverId: integer("receiver_id").notNull(),
  content: text("content").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  isOnline: true,
  lastSeen: true,
});

export const insertConnectionSchema = createInsertSchema(connections).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  isRead: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Connection = typeof connections.$inferSelect;
export type InsertConnection = z.infer<typeof insertConnectionSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

// Additional schemas for API requests
export const updateUserSchema = insertUserSchema.partial();
export const updateConnectionStatusSchema = z.object({
  status: z.enum(["accepted", "declined"]),
});

export const searchUsersSchema = z.object({
  query: z.string().optional(),
  experienceLevel: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
  openToCollaborate: z.boolean().optional(),
  isOnline: z.boolean().optional(),
});

export type UpdateUser = z.infer<typeof updateUserSchema>;
export type UpdateConnectionStatus = z.infer<typeof updateConnectionStatusSchema>;
export type SearchUsers = z.infer<typeof searchUsersSchema>;