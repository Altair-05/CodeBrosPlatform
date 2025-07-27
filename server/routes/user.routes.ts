import type { Router } from "express";
import { UserController } from "../controllers/user.controller";

export function registerUserRoutes(router: Router): void {
  const userController = new UserController();

  // User routes
  router.get("/api/users", (req, res) => userController.getAllUsers(req, res));
  router.get("/api/users/search", (req, res) => userController.searchUsers(req, res));
  router.get("/api/users/:id", (req, res) => userController.getUserById(req, res));
  router.post("/api/users", (req, res) => userController.createUser(req, res));
  router.patch("/api/users/:id", (req, res) => userController.updateUser(req, res));
  router.post("/api/users/:id/online-status", (req, res) => userController.setUserOnlineStatus(req, res));
} 