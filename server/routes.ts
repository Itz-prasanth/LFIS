import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes, isAuthenticated, isAdmin } from "./replit_integrations/auth";
import multer from "multer";
import path from "path";
import fs from "fs";


export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  await setupAuth(app);
  registerAuthRoutes(app);

  // ── Image Upload ───────────────────────────────────────────────────────────
  const __dirname = process.cwd();
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

  const upload = multer({
    storage: multer.diskStorage({
      destination: (_req, _file, cb) => cb(null, uploadsDir),
      filename: (_req, file, cb) => {
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
        cb(null, unique + path.extname(file.originalname));
      },
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    fileFilter: (_req, file, cb) => {
      if (file.mimetype.startsWith("image/")) cb(null, true);
      else cb(new Error("Only image files are allowed"));
    },
  });

  app.post("/api/upload", isAuthenticated, upload.single("image"), (req: any, res) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    res.json({ url: `/uploads/${req.file.filename}` });
  });

  // ── Items ──────────────────────────────────────────────────────────────────
  app.get(api.items.list.path, async (req, res) => {
    try {
      const params = api.items.list.input?.parse(req.query);
      const results = await storage.getItems(params);
      res.json(results);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message });
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.items.get.path, async (req, res) => {
    try {
      const item = await storage.getItem(req.params.id);
      if (!item) return res.status(404).json({ message: "Item not found" });
      res.json(item);
    } catch {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(api.items.create.path, isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.user.id;          // ← session, not req.user.claims.sub
      const input = api.items.create.input.parse({ ...req.body, userId });
      const newItem = await storage.createItem({ ...input, date: new Date(input.date) });
      res.status(201).json(newItem);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join(".") });
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch(api.items.update.path, isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.user.id;
      const existing = await storage.getItem(req.params.id);
      if (!existing) return res.status(404).json({ message: "Item not found" });
      if (existing.userId !== userId) return res.status(403).json({ message: "Forbidden" });
      const input = api.items.update.input.parse(req.body);
      res.json(await storage.updateItem(req.params.id, input));
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join(".") });
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete(api.items.delete.path, isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.user.id;
      const existing = await storage.getItem(req.params.id);
      if (!existing) return res.status(404).json({ message: "Item not found" });
      if (existing.userId !== userId) return res.status(403).json({ message: "Forbidden" });
      await storage.deleteItem(req.params.id);
      res.status(204).end();
    } catch {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // ── Messages ───────────────────────────────────────────────────────────────
  app.post(api.messages.create.path, async (req, res) => {
    try {
      const input = api.messages.create.input.parse(req.body);
      res.status(201).json(await storage.createMessage(input));
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join(".") });
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // ── Stats ──────────────────────────────────────────────────────────────────
  app.get(api.stats.get.path, async (_req, res) => {
    try {
      res.json(await storage.getStats());
    } catch {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // ── Admin Routes ───────────────────────────────────────────────────────────

  // GET all users
  app.get("/api/admin/users", isAuthenticated, isAdmin, async (_req, res) => {
    try {
      res.json(await storage.getAllUsers());
    } catch {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // DELETE a user
  app.delete("/api/admin/users/:id", isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const deleted = await storage.deleteUserById(req.params.id);
      if (!deleted) return res.status(404).json({ message: "User not found" });
      res.status(204).end();
    } catch {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // GET all items (admin – no ownership filter)
  app.get("/api/admin/items", isAuthenticated, isAdmin, async (_req, res) => {
    try {
      res.json(await storage.getItems());
    } catch {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // PATCH any item status (admin)
  app.patch("/api/admin/items/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const updated = await storage.adminUpdateItem(req.params.id, req.body);
      if (!updated) return res.status(404).json({ message: "Item not found" });
      res.json(updated);
    } catch {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // DELETE any item (admin)
  app.delete("/api/admin/items/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const deleted = await storage.adminDeleteItem(req.params.id);
      if (!deleted) return res.status(404).json({ message: "Item not found" });
      res.status(204).end();
    } catch {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // GET all messages (admin)
  app.get("/api/admin/messages", isAuthenticated, isAdmin, async (_req, res) => {
    try {
      res.json(await storage.getAllMessages());
    } catch {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // DELETE a message (admin)
  app.delete("/api/admin/messages/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      await storage.deleteMessage(req.params.id);
      res.status(204).end();
    } catch {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}
