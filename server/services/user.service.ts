import type { 
  User, 
  InsertUser, 
  UpdateUser, 
  SearchUsers 
} from "@shared/schema";
import { storage } from "../storage";

export class UserService {
  async getUser(id: number): Promise<User | undefined> {
    return await storage.getUser(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return await storage.getUserByUsername(username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return await storage.getUserByEmail(email);
  }

  async createUser(userData: InsertUser): Promise<User> {
    // Check if username or email already exists
    const existingUsername = await storage.getUserByUsername(userData.username);
    const existingEmail = await storage.getUserByEmail(userData.email);

    if (existingUsername) {
      throw new Error("Username already exists");
    }

    if (existingEmail) {
      throw new Error("Email already exists");
    }

    return await storage.createUser(userData);
  }

  async updateUser(id: number, updates: UpdateUser): Promise<User | undefined> {
    return await storage.updateUser(id, updates);
  }

  async searchUsers(criteria: SearchUsers): Promise<User[]> {
    return await storage.searchUsers(criteria);
  }

  async getAllUsers(): Promise<User[]> {
    return await storage.getAllUsers();
  }

  async setUserOnlineStatus(id: number, isOnline: boolean): Promise<void> {
    await storage.setUserOnlineStatus(id, isOnline);
  }
} 