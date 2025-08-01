import type { Express } from "express";
import { ConnectionsController } from "../controllers/connections.controller";

export function registerConnectionRoutes(app: Express): void {
  const connectionsController = new ConnectionsController();

  // Connection routes
  app.get("/api/connections/user/:userId", (req, res) => connectionsController.getConnectionsByUserId(req, res));
  app.get("/api/connections/pending/:userId", (req, res) => connectionsController.getPendingConnectionRequests(req, res));
  app.get("/api/connections/accepted/:userId", (req, res) => connectionsController.getAcceptedConnections(req, res));
  app.post("/api/connections", (req, res) => connectionsController.createConnection(req, res));
  app.patch("/api/connections/:id/status", (req, res) => connectionsController.updateConnectionStatus(req, res));
} 