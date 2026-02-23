import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { db } from "./db/index.js";
import altWatcherRouter from "./routes/altWatcher.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT = Number(process.env.PORT) || 8080;
const RATE_LIMIT_DISABLED =
  process.env.RATE_LIMIT_DISABLED === "1" ||
  process.env.RATE_LIMIT_DISABLED === "true";

// Run migrations on startup
const migrationsFolder = path.join(process.cwd(), "drizzle");
migrate(db, { migrationsFolder });

const app = express();
app.set("trust proxy", 1);

app.use(cors());
app.use(express.json());

// Rate limit: POST /altWatcher/link — 10 per 15 min per IP
const rateLimitPost = RATE_LIMIT_DISABLED
  ? (
      _req: express.Request,
      _res: express.Response,
      next: express.NextFunction
    ) => next()
  : rateLimit({
      windowMs: Number(process.env.RATE_LIMIT_POST_WINDOW_MS) || 15 * 60 * 1000,
      max: Number(process.env.RATE_LIMIT_POST_MAX) || 10,
      message: { error: "Too many requests, please try again later." },
      standardHeaders: true,
      legacyHeaders: false,
    });

// Rate limit: GET /altWatcher/link/:id/inc-num — 60 per minute per IP
const rateLimitInc = RATE_LIMIT_DISABLED
  ? (
      _req: express.Request,
      _res: express.Response,
      next: express.NextFunction
    ) => next()
  : rateLimit({
      windowMs: Number(process.env.RATE_LIMIT_INC_WINDOW_MS) || 60 * 1000,
      max: Number(process.env.RATE_LIMIT_INC_MAX) || 60,
      message: { error: "Too many requests, please try again later." },
      standardHeaders: true,
      legacyHeaders: false,
    });

// Apply rate limits to specific routes (we'll add them in the router or here by mounting with middleware)
// Mount altWatcher router; rate limits are applied per-route inside the router
app.use(
  "/altWatcher",
  (req, res, next) => {
    if (req.method === "POST" && req.path === "/link") {
      return rateLimitPost(req, res, next);
    }
    if (
      req.method === "GET" &&
      /^\/link\/\d+\/inc-num-of-downloads$/.test(req.path)
    ) {
      return rateLimitInc(req, res, next);
    }
    next();
  },
  altWatcherRouter
);

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
