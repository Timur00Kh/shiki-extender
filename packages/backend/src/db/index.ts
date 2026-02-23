import fs from "fs";
import path from "path";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema.js";

const dbPath = process.env.DB_PATH ?? "./data/db.sqlite";
const dir = path.dirname(dbPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}
const sqlite = new Database(dbPath);
export const db = drizzle(sqlite, { schema });
export * from "./schema.js";
