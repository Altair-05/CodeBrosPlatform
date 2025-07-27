import type { 
  Connection, 
  InsertConnection, 
  User 
} from "@shared/schema";
import { storage } from "../storage";

export class ConnectionService {
  async getConnection(requesterId: number, receiverId: number): Promise<Connection | undefined> {
    return await storage.getConnection(requesterId, receiverId);
  }

  async getConnectionsByUserId(userId: number): Promise<Connection[]> {
    return await storage.getConnectionsByUserId(userId);
  }

  async getPendingConnectionRequests(userId: number): Promise<Connection[]> {
    return await storage.getPendingConnectionRequests(userId);
  }

  async createConnection(connectionData: InsertConnection): Promise<Connection> {
    // Check if connection already exists
    const existing = await storage.getConnection(
      connectionData.requesterId,
      connectionData.receiverId
    );

    if (existing) {
      throw new Error("Connection already exists");
    }

    return await storage.createConnection(connectionData);
  }

  async updateConnectionStatus(id: number, status: string): Promise<Connection | undefined> {
    return await storage.updateConnectionStatus(id, status);
  }

  async getAcceptedConnections(userId: number): Promise<User[]> {
    return await storage.getAcceptedConnections(userId);
  }
} 