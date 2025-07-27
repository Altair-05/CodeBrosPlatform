import type { Router } from "express";
import { ConnectionsController } from "../controllers/connections.controller";

export function registerConnectionRoutes(router: Router): void {
  const connectionsController = new ConnectionsController();

  // Connection routes
  router.get("/api/connections/user/:userId", (req, res) => connectionsController.getConnectionsByUserId(req, res));
  router.get("/api/connections/pending/:userId", (req, res) => connectionsController.getPendingConnectionRequests(req, res));
  router.get("/api/connections/accepted/:userId", (req, res) => connectionsController.getAcceptedConnections(req, res));
  router.post("/api/connections", (req, res) => connectionsController.createConnection(req, res));
  router.patch("/api/connections/:id/status", (req, res) => connectionsController.updateConnectionStatus(req, res));
} 