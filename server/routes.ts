import type { Express } from "express";
import { createServer, type Server } from "http";
import { 
  registerUserRoutes, 
  registerConnectionRoutes, 
  registerMessageRoutes,
} from "./routes/index";

export async function registerRoutes(app: Express): Promise<Server> {
  // Register all route modules
  registerUserRoutes(app);
  registerConnectionRoutes(app);
  registerMessageRoutes(app);

  const httpServer = createServer(app);
  return httpServer;
}
