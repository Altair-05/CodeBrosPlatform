import type { Express } from "express";
import { UserController } from "../controllers/user.controller";

export function registerUserRoutes(app: Express): void {
  const userController = new UserController();

  // User routes
  app.get("/api/users", (req, res) => userController.getAllUsers(req, res));
  app.get("/api/users/search", (req, res) => userController.searchUsers(req, res));
  app.get("/api/users/:id", (req, res) => userController.getUserById(req, res));
  app.post("/api/users", (req, res) => userController.createUser(req, res));
  app.patch("/api/users/:id", (req, res) => userController.updateUser(req, res));
  app.post("/api/users/:id/online-status", (req, res) => userController.setUserOnlineStatus(req, res));
  
  // Authentication route
  app.post("/api/auth/login", (req, res) => userController.login(req, res));
} 