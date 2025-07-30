import type { Express } from "express";
import { MessagesController } from "../controllers/messages.controller";

export function registerMessageRoutes(app: Express): void {
  const messagesController = new MessagesController();

  // Message routes
  app.get("/api/messages/conversation/:user1Id/:user2Id", (req, res) => messagesController.getMessagesBetweenUsers(req, res));
  app.get("/api/messages/conversations/:userId", (req, res) => messagesController.getConversations(req, res));
  app.post("/api/messages", (req, res) => messagesController.createMessage(req, res));
  app.post("/api/messages/mark-read", (req, res) => messagesController.markMessagesAsRead(req, res));
} 