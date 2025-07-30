import type { Express } from "express";
import { createServer, type Server } from "http";
import { 
  registerUserRoutes, 
  registerConnectionRoutes, 
  registerMessageRoutes,
} from "./routes/index";

export async function registerRoutes(app: Express): Promise<Server> {
  // Modular route registration
  registerUserRoutes(app);
  registerConnectionRoutes(app);
  registerMessageRoutes(app);

  // Create and return HTTP server
  const httpServer = createServer(app);
  return httpServer;
}
