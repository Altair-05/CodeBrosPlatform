// Shared types for frontend and backend compatibility - PostgreSQL Model
export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  title: string;
  bio?: string;
  experienceLevel: "beginner" | "intermediate" | "professional";
  skills: string[];
  profileImage?: string;
  isOnline: boolean;
  openToCollaborate: boolean;
  lastSeen?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Connection {
  id: number;
  requesterId: number;
  receiverId: number;
  status: "pending" | "accepted" | "declined";
  message?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  isRead: boolean;
  createdAt?: Date;
}

export interface Conversation {
  user: User;
  lastMessage: Message;
  unreadCount: number;
}

// API Request/Response types
export interface InsertUser {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  title: string;
  bio?: string;
  experienceLevel: "beginner" | "intermediate" | "professional";
  skills?: string[];
  profileImage?: string;
  openToCollaborate?: boolean;
}

export interface InsertConnection {
  requesterId: number;
  receiverId: number;
  status: "pending" | "accepted" | "declined";
  message?: string;
}

export interface InsertMessage {
  senderId: number;
  receiverId: number;
  content: string;
}

export interface UpdateUser {
  username?: string;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  title?: string;
  bio?: string;
  experienceLevel?: "beginner" | "intermediate" | "professional";
  skills?: string[];
  profileImage?: string;
  openToCollaborate?: boolean;
}

export interface SearchUsers {
  query?: string;
  experienceLevel?: string[];
  skills?: string[];
  openToCollaborate?: boolean;
  isOnline?: boolean;
}

// Connection status type
export type ConnectionStatus = 'none' | 'pending' | 'connected';