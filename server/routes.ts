import type { Express } from "express";
import { createServer, type Server } from "http";
import { mongoStorage } from "./db/mongo.js";
import { 
  insertUserSchema, 
  insertConnectionSchema,
  insertMessageSchema,
  updateUserSchema,
  updateConnectionStatusSchema,
  searchUsersSchema
} from "@shared/mongo-schema";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.get("/api/users", async (req, res) => {
    try {
      const users = await mongoStorage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get("/api/users/search", async (req, res) => {
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
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const user = await mongoStorage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username or email already exists
      const existingUsername = await mongoStorage.getUserByUsername(userData.username);
      const existingEmail = await mongoStorage.getUserByEmail(userData.email);
      
      if (existingUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const user = await mongoStorage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.patch("/api/users/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const updates = updateUserSchema.parse(req.body);
      const user = await mongoStorage.updateUser(id, updates);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: "Invalid update data" });
    }
  });

  app.post("/api/users/:id/online-status", async (req, res) => {
    try {
      const id = req.params.id;
      const { isOnline } = req.body;
      await mongoStorage.setUserOnlineStatus(id, isOnline);
      res.json({ message: "Status updated" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update status" });
    }
  });

  // Connection routes
  app.get("/api/connections/user/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const connections = await mongoStorage.getConnectionsByUserId(userId);
      res.json(connections);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch connections" });
    }
  });

  app.get("/api/connections/pending/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const requests = await mongoStorage.getPendingConnectionRequests(userId);
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pending requests" });
    }
  });

  app.get("/api/connections/accepted/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const connections = await mongoStorage.getAcceptedConnections(userId);
      res.json(connections);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch accepted connections" });
    }
  });

  app.post("/api/connections", async (req, res) => {
    try {
      const connectionData = insertConnectionSchema.parse(req.body);
      
      // Check if connection already exists
      const existing = await mongoStorage.getConnection(
        connectionData.requesterId.toString(), 
        connectionData.receiverId.toString()
      );
      
      if (existing) {
        return res.status(400).json({ message: "Connection already exists" });
      }

      const connection = await mongoStorage.createConnection(connectionData);
      res.status(201).json(connection);
    } catch (error) {
      res.status(400).json({ message: "Invalid connection data" });
    }
  });

  app.patch("/api/connections/:id/status", async (req, res) => {
    try {
      const id = req.params.id;
      const { status } = updateConnectionStatusSchema.parse(req.body);
      const connection = await mongoStorage.updateConnectionStatus(id, status);
      
      if (!connection) {
        return res.status(404).json({ message: "Connection not found" });
      }
      
      res.json(connection);
    } catch (error) {
      res.status(400).json({ message: "Invalid status update" });
    }
  });

  // Message routes
  app.get("/api/messages/conversation/:user1Id/:user2Id", async (req, res) => {
    try {
      const user1Id = req.params.user1Id;
      const user2Id = req.params.user2Id;
      const messages = await mongoStorage.getMessagesBetweenUsers(user1Id, user2Id);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.get("/api/messages/conversations/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const conversations = await mongoStorage.getConversations(userId);
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });

  app.post("/api/messages", async (req, res) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      const message = await mongoStorage.createMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      res.status(400).json({ message: "Invalid message data" });
    }
  });

  app.post("/api/messages/mark-read", async (req, res) => {
    try {
      const { senderId, receiverId } = req.body;
      await mongoStorage.markMessagesAsRead(senderId, receiverId);
      res.json({ message: "Messages marked as read" });
    } catch (error) {
      res.status(500).json({ message: "Failed to mark messages as read" });
    }
  });

  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      const user = await mongoStorage.getUserByEmail(email);
      
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      // In a real app, you'd hash the password and compare hashes
      if (user.password !== password) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      // Don't send password back to client
      const { password: _, ...userWithoutPassword } = user;
      
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: "Invalid login data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
