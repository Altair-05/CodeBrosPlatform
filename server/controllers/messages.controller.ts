import type { Request, Response } from "express";
import { mongoStorage } from "../db/mongo.js";
import { insertMessageSchema } from "@shared/mongo-schema";

export class MessagesController {
  async getMessagesBetweenUsers(req: Request, res: Response): Promise<void> {
    try {
      const messages = await mongoStorage.getMessagesBetweenUsers(
        req.params.user1Id, req.params.user2Id
      );
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  }

  async getConversations(req: Request, res: Response): Promise<void> {
    try {
      const conversations = await mongoStorage.getConversations(req.params.userId);
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  }

  async createMessage(req: Request, res: Response): Promise<void> {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      const message = await mongoStorage.createMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      res.status(400).json({ message: "Invalid message data" });
    }
  }

  async markMessagesAsRead(req: Request, res: Response): Promise<void> {
    try {
      const { senderId, receiverId } = req.body;
      await mongoStorage.markMessagesAsRead(senderId, receiverId);
      res.json({ message: "Messages marked as read" });
    } catch (error) {
      res.status(500).json({ message: "Failed to mark messages as read" });
    }
  }
} 