import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import { connectDB } from "./db";

const app = express();
const httpServer = createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

export function log(message: string, source = "express") {
  const t = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true });
  console.log(`${t} [${source}] ${message}`);
}

// Request logger
app.use((req, res, next) => {
  const start = Date.now();
  let body: any;
  const orig = res.json;
  res.json = function (b, ...a) { body = b; return orig.apply(res, [b, ...a]); };
  res.on("finish", () => {
    if (req.path.startsWith("/api")) {
      let line = `${req.method} ${req.path} ${res.statusCode} in ${Date.now() - start}ms`;
      if (body) line += ` :: ${JSON.stringify(body)}`;
      log(line);
    }
  });
  next();
});

(async () => {
  // 1. Connect to MongoDB first
  await connectDB();

  // 2. Register all routes
  await registerRoutes(httpServer, app);

  // 3. Global error handler
  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    console.error("Error:", err.message);
    if (res.headersSent) return next(err);
    res.status(status).json({ message: err.message || "Internal Server Error" });
  });

  // 4. Serve frontend
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // 5. Start server — use simple port binding (not 0.0.0.0 / reusePort — those are Replit-specific)
  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(port, () => {
    log(`🚀 Server running at http://localhost:${port}`);
  });
})();
