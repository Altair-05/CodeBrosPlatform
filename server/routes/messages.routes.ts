import type { Router } from "express";
import { MessagesController } from "../controllers/messages.controller";

export function registerMessageRoutes(router: Router): void {
  const messagesController = new MessagesController();

  // Message routes
  router.get("/api/messages/conversation/:user1Id/:user2Id", (req, res) => messagesController.getMessagesBetweenUsers(req, res));
  router.get("/api/messages/conversations/:userId", (req, res) => messagesController.getConversations(req, res));
  router.post("/api/messages", (req, res) => messagesController.createMessage(req, res));
  router.post("/api/messages/mark-read", (req, res) => messagesController.markMessagesAsRead(req, res));
} 