import type { 
  Message, 
  InsertMessage, 
  User 
} from "@shared/schema";
import { storage } from "../storage";

export class MessagesService {
  async createMessage(messageData: InsertMessage): Promise<Message> {
    return await storage.createMessage(messageData);
  }

  async getMessagesBetweenUsers(user1Id: number, user2Id: number): Promise<Message[]> {
    return await storage.getMessagesBetweenUsers(user1Id, user2Id);
  }

  async getConversations(userId: number): Promise<Array<{ user: User; lastMessage: Message; unreadCount: number }>> {
    return await storage.getConversations(userId);
  }

  async markMessagesAsRead(senderId: number, receiverId: number): Promise<void> {
    await storage.markMessagesAsRead(senderId, receiverId);
  }
} 