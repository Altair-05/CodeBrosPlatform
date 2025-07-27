import type { Request, Response } from "express";
import { MessagesService } from "../services/messages.service";
import { insertMessageSchema } from "@shared/schema";

export class MessagesController {
  private messagesService: MessagesService;

  constructor() {
    this.messagesService = new MessagesService();
  }

  async getMessagesBetweenUsers(req: Request, res: Response): Promise<void> {
    try {
      const user1Id = parseInt(req.params.user1Id);
      const user2Id = parseInt(req.params.user2Id);
      const messages = await this.messagesService.getMessagesBetweenUsers(user1Id, user2Id);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  }

  async getConversations(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId);
      const conversations = await this.messagesService.getConversations(userId);
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  }

  async createMessage(req: Request, res: Response): Promise<void> {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      const message = await this.messagesService.createMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      res.status(400).json({ message: "Invalid message data" });
    }
  }

  async markMessagesAsRead(req: Request, res: Response): Promise<void> {
    try {
      const { senderId, receiverId } = req.body;
      await this.messagesService.markMessagesAsRead(senderId, receiverId);
      res.json({ message: "Messages marked as read" });
    } catch (error) {
      res.status(500).json({ message: "Failed to mark messages as read" });
    }
  }
} 