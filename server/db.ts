import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema"; // Import your Drizzle schema

// Ensure WebSocket constructor is set for Neon serverless
neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Create a database pool
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Initialize Drizzle ORM client
export const db = drizzle(pool, { schema }); // Pass the schema object to drizzle

// Export for direct use in storage.ts or other parts if needed
export type DrizzleDb = typeof db;