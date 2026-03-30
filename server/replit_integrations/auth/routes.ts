import type { Express } from "express";

export function registerAuthRoutes(app: Express): void {
  // Return session user directly — no DB round-trip needed
  app.get("/api/auth/user", (req: any, res) => {
    if (!req.session?.user) return res.status(401).json({ message: "Unauthorized" });
    res.json(req.session.user);
  });
}
