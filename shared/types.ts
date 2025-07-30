// Shared types for frontend and backend compatibility
export interface User {
  // DELETE THIS LINE: _id: string;
  id: number; // ADD THIS LINE - The ID is a number from the API (as per Drizzle schema)
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
  createdAt: Date;
  updatedAt: Date;
}

export interface Connection {
  // DELETE THIS LINE: _id: string;
  id: number; // ADD THIS LINE
  requesterId: number; // CHANGE TO number
  receiverId: number; // CHANGE TO number
  status: "pending" | "accepted" | "declined";
  message?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  // DELETE THIS LINE: _id: string;
  id: number; // ADD THIS LINE
  senderId: number; // CHANGE TO number
  receiverId: number; // CHANGE TO number
  content: string;
  isRead: boolean;
  createdAt: Date;
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
  requesterId: number; // CHANGE TO number
  receiverId: number; // CHANGE TO number
  status: "pending" | "accepted" | "declined";
  message?: string;
}

export interface InsertMessage {
  senderId: number; // CHANGE TO number
  receiverId: number; // CHANGE TO number
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