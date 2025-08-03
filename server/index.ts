

import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";

import { setupVite, serveStatic, log } from "./vite";
// import { mongoStorage } from "./db/mongo.js"; // Removed MongoDB import
import { storage } from "./storage"; // Use the new DrizzleStorage

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    // No explicit connect call for Drizzle client, it uses the pool.
    // Optionally initialize sample data here if needed for fresh DB setup
    if (process.env.NODE_ENV === "development") { // Only run in development
      await storage.initializeSampleData(); // Call sample data initializer
    }

    const server = await registerRoutes(app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ message });
      console.error(err); // Log the error for debugging
      // Do not throw err here in production; only for development/debugging to see full stack trace
      // throw err; // Removed re-throw to avoid unhandled promise rejection in Express
    });

    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    const port = 5000;
    server.listen(port, () => {
      log(`serving on port ${port}`);
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      log('Shutting down server...');
      // Drizzle pool might need explicit end, but often handled automatically on process exit
      // if (pool) await pool.end(); // If pool is exported directly or accessible
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      log('Shutting down server...');
      // if (pool) await pool.end();
      process.exit(0);
    });

  } catch (error) {
    log("Failed to start server:", error);
    process.exit(1);
  }
})();