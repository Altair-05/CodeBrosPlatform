import type { Request, Response } from "express";
import { mongoStorage } from "../db/mongo.js";
import {
  insertConnectionSchema,
  updateConnectionStatusSchema
} from "@shared/mongo-schema";

export class ConnectionsController {
  async getConnectionsByUserId(req: Request, res: Response): Promise<void> {
    try {
      const connections = await mongoStorage.getConnectionsByUserId(req.params.userId);
      res.json(connections);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch connections" });
    }
  }

  async getPendingConnectionRequests(req: Request, res: Response): Promise<void> {
    try {
      const requests = await mongoStorage.getPendingConnectionRequests(req.params.userId);
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pending requests" });
    }
  }

  async getAcceptedConnections(req: Request, res: Response): Promise<void> {
    try {
      const connections = await mongoStorage.getAcceptedConnections(req.params.userId);
      res.json(connections);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch accepted connections" });
    }
  }

  async createConnection(req: Request, res: Response): Promise<void> {
    try {
      const connectionData = insertConnectionSchema.parse(req.body);
      const existing = await mongoStorage.getConnection(
        (connectionData.requesterId as any).toString(), 
        (connectionData.receiverId as any).toString()
      );
      if (existing) {
        res.status(400).json({ message: "Connection already exists" });
        return;
      }
      const connection = await mongoStorage.createConnection(connectionData);
      res.status(201).json(connection);
    } catch (error) {
      res.status(400).json({ message: "Invalid connection data" });
    }
  }

  async updateConnectionStatus(req: Request, res: Response): Promise<void> {
    try {
      const { status } = updateConnectionStatusSchema.parse(req.body);
      const connection = await mongoStorage.updateConnectionStatus(req.params.id, status);

      if (!connection) {
        res.status(404).json({ message: "Connection not found" });
        return;
      }

      res.json(connection);
    } catch (error) {
      res.status(400).json({ message: "Invalid status update" });
    }
  }
} 