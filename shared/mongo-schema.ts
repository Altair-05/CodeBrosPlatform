import { z } from "zod";
import { ObjectId } from "mongodb";

// MongoDB Schemas
export const userSchema = z.object({
  _id: z.instanceof(ObjectId).optional(),
  username: z.string().min(3).max(30),
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  title: z.string().min(1).max(100),
  bio: z.string().max(500).optional(),
  experienceLevel: z.enum(["beginner", "intermediate", "professional"]),
  skills: z.array(z.string()).default([]),
  profileImage: z.string().url().optional(),
  isOnline: z.boolean().default(false),
  openToCollaborate: z.boolean().default(true),
  lastSeen: z.date().optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export const connectionSchema = z.object({
  _id: z.instanceof(ObjectId).optional(),
  requesterId: z.instanceof(ObjectId),
  receiverId: z.instanceof(ObjectId),
  status: z.enum(["pending", "accepted", "declined"]),
  message: z.string().max(200).optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export const messageSchema = z.object({
  _id: z.instanceof(ObjectId).optional(),
  senderId: z.instanceof(ObjectId),
  receiverId: z.instanceof(ObjectId),
  content: z.string().min(1).max(1000),
  isRead: z.boolean().default(false),
  createdAt: z.date().default(() => new Date()),
});

// Insert schemas (for creating new documents)
export const insertUserSchema = userSchema.omit({
  _id: true,
  isOnline: true,
  lastSeen: true,
  createdAt: true,
  updatedAt: true,
});

export const insertConnectionSchema = connectionSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMessageSchema = messageSchema.omit({
  _id: true,
  isRead: true,
  createdAt: true,
});

// Update schemas
export const updateUserSchema = insertUserSchema.partial();
export const updateConnectionStatusSchema = z.object({
  status: z.enum(["accepted", "declined"]),
});

// Search schema
export const searchUsersSchema = z.object({
  query: z.string().optional(),
  experienceLevel: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
  openToCollaborate: z.boolean().optional(),
  isOnline: z.boolean().optional(),
});

// TypeScript types
export type User = z.infer<typeof userSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;

export type Connection = z.infer<typeof connectionSchema>;
export type InsertConnection = z.infer<typeof insertConnectionSchema>;
export type UpdateConnectionStatus = z.infer<typeof updateConnectionStatusSchema>;

export type Message = z.infer<typeof messageSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type SearchUsers = z.infer<typeof searchUsersSchema>;

// MongoDB Collection names
export const COLLECTIONS = {
  USERS: "users",
  CONNECTIONS: "connections",
  MESSAGES: "messages",
} as const; 