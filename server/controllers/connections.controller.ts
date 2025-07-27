import type { Request, Response } from "express";
import { ConnectionService } from "../services/connection.service";
import {
  insertConnectionSchema,
  updateConnectionStatusSchema
} from "@shared/schema";

export class ConnectionsController {
  private connectionService: ConnectionService;

  constructor() {
    this.connectionService = new ConnectionService();
  }

  async getConnectionsByUserId(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId);
      const connections = await this.connectionService.getConnectionsByUserId(userId);
      res.json(connections);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch connections" });
    }
  }

  async getPendingConnectionRequests(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId);
      const requests = await this.connectionService.getPendingConnectionRequests(userId);
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pending requests" });
    }
  }

  async getAcceptedConnections(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId);
      const connections = await this.connectionService.getAcceptedConnections(userId);
      res.json(connections);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch accepted connections" });
    }
  }

  async createConnection(req: Request, res: Response): Promise<void> {
    try {
      const connectionData = insertConnectionSchema.parse(req.body);
      const connection = await this.connectionService.createConnection(connectionData);
      res.status(201).json(connection);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(400).json({ message: "Invalid connection data" });
      }
    }
  }

  async updateConnectionStatus(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const { status } = updateConnectionStatusSchema.parse(req.body);
      const connection = await this.connectionService.updateConnectionStatus(id, status);

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