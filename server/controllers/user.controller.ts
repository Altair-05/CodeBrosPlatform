import type { Request, Response } from "express";
import { mongoStorage } from "../db/mongo.js";
import {
  insertUserSchema,
  updateUserSchema,
  searchUsersSchema
} from "@shared/mongo-schema";
import { z } from "zod";

// Login schema
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export class UserController {
  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await mongoStorage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  }

  async searchUsers(req: Request, res: Response): Promise<void> {
    try {
      // Parse query parameters - handle arrays correctly
      const query = req.query as any;
      const searchParams = {
        query: query.query || undefined,
        experienceLevel: Array.isArray(query.experienceLevel)
          ? query.experienceLevel
          : query.experienceLevel
            ? [query.experienceLevel]
            : undefined,
        skills: Array.isArray(query.skills)
          ? query.skills
          : query.skills
            ? [query.skills]
            : undefined,
        openToCollaborate: query.openToCollaborate === 'true' ? true : undefined,
        isOnline: query.isOnline === 'true' ? true : undefined,
      };

      // Remove undefined values
      const cleanedParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, v]) => v !== undefined)
      );

      const users = await mongoStorage.searchUsers(cleanedParams);
      res.json(users);
    } catch (error) {
      console.error('Search error:', error);
      res.status(400).json({ message: "Invalid search parameters" });
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const user = await mongoStorage.getUser(req.params.id);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  }

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUsername = await mongoStorage.getUserByUsername(userData.username);
      const existingEmail = await mongoStorage.getUserByEmail(userData.email);
      if (existingUsername) {
        res.status(400).json({ message: "Username already exists" });
        return;
      }
      if (existingEmail) {
        res.status(400).json({ message: "Email already exists" });
        return;
      }
      const user = await mongoStorage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const updates = updateUserSchema.parse(req.body);
      const user = await mongoStorage.updateUser(req.params.id, updates);

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      res.json(user);
    } catch (error) {
      res.status(400).json({ message: "Invalid update data" });
    }
  }

  async setUserOnlineStatus(req: Request, res: Response): Promise<void> {
    try {
      const { isOnline } = req.body;
      await mongoStorage.setUserOnlineStatus(req.params.id, isOnline);
      res.json({ message: "Status updated" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update status" });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = loginSchema.parse(req.body);
      const user = await mongoStorage.getUserByEmail(email);
      if (!user || user.password !== password) {
        res.status(401).json({ message: "Invalid email or password" });
        return;
      }
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: "Invalid login data" });
    }
  }
} 