import type { Express, Request, Response, NextFunction } from "express";
import * as mongoStorage from "./storage";
import { ObjectId } from "mongodb";

/**
 * Wire API routes on the provided Express app.
 * This module is intentionally self‑contained (no client imports).
 */
export async function registerRoutes(app: Express): Promise<void> {
  // ────────────────────────────────────────────────────────────────────────────
  // Health check
  app.get("/api/__index_ok", (_req, res) => {
    res.json({ ok: true });
  });

  // ────────────────────────────────────────────────────────────────────────────
  // Debug: environment and storage shape
  app.get("/api/__debug/stats", (_req, res) => {
    let dbTruthy = false;
    try {
      const db = mongoStorage.getDb();
      dbTruthy = !!db;
    } catch {
      dbTruthy = false;
    }

    res.json({
      NODE_ENV: process.env.NODE_ENV,
      hasMongoStorage: !!mongoStorage,
      hasGetDb: typeof (mongoStorage as any).getDb === "function",
      dbTruthy,
    });
  });

  // Debug: list existing collections (helps confirm we are in the right DB)
  app.get("/api/__debug/collections", async (_req: Request, res: Response) => {
    try {
      const db = mongoStorage.getDb();
      const collections = (await db.listCollections().toArray()).map((c: any) => c.name);
      res.json({ collections });
    } catch (err) {
      console.error("Error in GET /api/__debug/collections", err);
      res.status(500).json({ message: "Failed to list collections" });
    }
  });

  // Debug: list a few user/profile ids so we can quickly test stats
  app.get("/api/__debug/users", async (req: Request, res: Response) => {
    try {
      const db = mongoStorage.getDb();
      const requested = (req.query.col as string | undefined)?.trim();
      const existing = new Set((await db.listCollections().toArray()).map((c: any) => c.name));

      // try the explicitly requested collection first; otherwise try likely options
      const candidates = requested ? [requested] : ["profiles", "users", "accounts", "members"];

      let from: string | null = null;
      let ids: string[] = [];

      for (const name of candidates) {
        if (!existing.has(name)) continue;
        const docs = await db
          .collection(name)
          .find({}, { projection: { _id: 1 } })
          .limit(5)
          .toArray();

        if (docs.length) {
          from = name;
          ids = docs.map((d: any) => String(d._id));
          break;
        }
      }

      return res.json({ from, ids });
    } catch (err) {
      console.error("Error in GET /api/__debug/users", err);
      res.status(500).json({ message: "Failed to list users" });
    }
  });

  // Debug: return any one id from known collections
  app.get("/api/__debug/anyId", async (_req: Request, res: Response) => {
    try {
      const db = mongoStorage.getDb();
      const candidates = ["profiles", "users", "projects", "connections", "profileViews"];

      for (const name of candidates) {
        const doc = await db.collection(name).findOne({}, { projection: { _id: 1 } });
        if (doc?._id) {
          return res.json({ collection: name, _id: String(doc._id) });
        }
      }

      res.status(404).json({ message: "No documents found in known collections" });
    } catch (err) {
      console.error("Error in GET /api/__debug/anyId", err);
      res.status(500).json({ message: "Failed to fetch any id" });
    }
  });

  // ────────────────────────────────────────────────────────────────────────────
  // Feature: profile stats for a given user
  app.get("/api/users/:userId/stats", async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;

      // robust validation for Mongo ObjectId
      if (!ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid user id" });
      }
      const _id = new ObjectId(userId);

      const db = mongoStorage.getDb();

      // Count connections (accepted where the user is either side),
      // projects (active/ongoing where user is in members),
      // and profile views for that user id.
      const [connectionsCount, projectsCount, viewsCount] = await Promise.all([
        db.collection("connections").countDocuments({
          status: "accepted",
          $or: [{ fromUserId: _id }, { toUserId: _id }],
        }),
        db.collection("projects").countDocuments({
          status: { $in: ["active", "ongoing"] },
          members: _id,
        }),
        db.collection("profileViews").countDocuments({ profileId: _id }),
      ]);

      res.json({
        connections: connectionsCount,
        projects: projectsCount,
        views: viewsCount,
      });
    } catch (error) {
      console.error("Error in GET /api/users/:userId/stats", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err?.status || err?.statusCode || 500;
    res.status(status).json({ message: err?.message || "Server error" });
  });
}