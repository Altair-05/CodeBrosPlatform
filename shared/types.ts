// Shared types for frontend and backend compatibility
export interface User {
  _id: string;
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
  _id: string;
  requesterId: string;
  receiverId: string;
  status: "pending" | "accepted" | "declined";
  message?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
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
  requesterId: string;
  receiverId: string;
  status: "pending" | "accepted" | "declined";
  message?: string;
}

export interface InsertMessage {
  senderId: string;
  receiverId: string;
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