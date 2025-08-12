// server/index.ts
import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { registerRoutes } from "./routes";
import * as mongo from "./storage";

(async () => {
  try {
    const app = express();
    const allowed = (process.env.CORS_ORIGIN ?? "http://localhost:5000,http://localhost:5173").split(",").map(s => s.trim());
    app.use(cors({ origin: allowed, credentials: true }));
    // enable preflight for all routes
    app.options("*", cors());
    app.use(express.json());

    // Connect to Mongo
    await mongo.connect();
    console.log("[express] Connected to MongoDB successfully");

    // Health check
    app.get("/api/__index_ok", (_req: Request, res: Response) => res.json({ ok: true }));

    // Debug: list collections
    app.get("/api/__debug/collections", async (_req: Request, res: Response) => {
      try {
        const db = mongo.getDb();
        const cols = await db.listCollections().toArray();
        res.json({ collections: cols.map((c: any) => c.name) });
      } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Failed to list collections" });
      }
    });

    // Debug: try to fetch a few user ids (pass ?col= if you know the name)
    app.get("/api/__debug/users", async (req: Request, res: Response) => {
      try {
        const db = mongo.getDb();
        const requested = (req.query.col as string | undefined)?.trim();
        const existing = new Set((await db.listCollections().toArray()).map((c: any) => c.name));
        const candidates = requested ? [requested] : ["users", "profiles", "accounts", "members"];

        let from: string | null = null;
        let ids: any[] = [];
        for (const name of candidates) {
          if (!existing.has(name)) continue;
          const docs = await db.collection(name).find({}, { projection: { _id: 1 } }).limit(5).toArray();
          if (docs.length) {
            from = name;
            ids = docs.map((d: any) => d._id);
            break;
          }
        }
        res.json({ from, ids });
      } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Failed to list users" });
      }
    });

    // Register API routes
    await registerRoutes(app);

    // 404 for unknown /api paths
    app.use("/api", (_req, res) => res.status(404).json({ message: "Not found" }));

    // Error handler
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err?.status || err?.statusCode || 500;
      res.status(status).json(
        process.env.NODE_ENV === "production"
          ? { message: "Server error" }
          : { message: err?.message || "Server error", stack: err?.stack }
      );
    });

    const port = Number(process.env.PORT) || 5001;
    app.listen(port, () => console.log(`[express] serving on port ${port}`));
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
})();
