import express from "express";
import cors from "cors";

const app = express();
// Restrictive CORS for security: allow requests from the proxy (same host/port) or explicit origins.
// In development you can set FRONTEND_ORIGIN or allow all if needed. Here we allow same origin and localhost.
const corsOptions = {
  origin: (origin: any, callback: any) => {
    // allow requests with no origin (e.g., curl, Postman)
    if (!origin) return callback(null, true);
    // allow localhost origins and the proxy host
    if (origin.startsWith("http://localhost") || origin.startsWith("http://127.0.0.1")) {
      return callback(null, true);
    }
    // otherwise reject
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// root API endpoint - some clients (Prisma Studio) call GET /api/ to probe the backend.
app.get("/api/", (_req, res) => {
  res.json({ ok: true, service: "gdps-backend", time: new Date().toISOString() });
});

app.get("/api/getConfig", (req, res) => {
  (async () => {
    try {
      const fs = await import("fs/promises");
      const path = await import("path");
      const configPath = path.join(process.cwd(), "config", "config.json");
      const raw = await fs.readFile(configPath, "utf8");
      const json = JSON.parse(raw);
      res.json(json);
    } catch (error) {
      console.error("Error reading config:", error);
      res.status(500).json({ error: "Failed to load config" });
    }
  })();
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://0.0.0.0:${PORT}`);
});
