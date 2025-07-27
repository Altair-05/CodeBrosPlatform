import type { Request, Response } from "express";
import { UserService } from "../services/user.service";
import {
  insertUserSchema,
  updateUserSchema,
  searchUsersSchema
} from "@shared/schema";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.userService.getAllUsers();
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

      const users = await this.userService.searchUsers(cleanedParams);
      res.json(users);
    } catch (error) {
      console.error('Search error:', error);
      res.status(400).json({ message: "Invalid search parameters" });
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const user = await this.userService.getUser(id);
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
      const user = await this.userService.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(400).json({ message: "Invalid user data" });
      }
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const updates = updateUserSchema.parse(req.body);
      const user = await this.userService.updateUser(id, updates);

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
      const id = parseInt(req.params.id);
      const { isOnline } = req.body;
      await this.userService.setUserOnlineStatus(id, isOnline);
      res.json({ message: "Status updated" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update status" });
    }
  }
} 