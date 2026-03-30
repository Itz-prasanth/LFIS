import { z } from "zod";

// ── Item schema ─────────────────────────────────────────────────────────────
export const insertItemSchema = z.object({
  title:       z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category:    z.string().min(1, "Category is required"),
  type:        z.enum(["lost", "found"]),
  location:    z.string().min(1, "Location is required"),
  date:        z.coerce.date(),
  imageUrl:    z.string().optional().nullable(),
  contactInfo: z.string().min(1, "Contact info is required"),
  userId:      z.string().optional(),
});

export type InsertItem = z.infer<typeof insertItemSchema>;

export type Item = InsertItem & {
  id: string;
  status: "pending" | "claimed";
  createdAt?: Date;
  updatedAt?: Date;
};

// ── Message schema ───────────────────────────────────────────────────────────
export const insertMessageSchema = z.object({
  name:    z.string().min(1, "Name is required"),
  email:   z.string().email("Valid email required"),
  message: z.string().min(1, "Message is required"),
});

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = InsertMessage & { id: string; createdAt?: Date };

// ── Type aliases used across the app ────────────────────────────────────────
export type CreateItemRequest    = InsertItem;
export type UpdateItemRequest    = Partial<InsertItem> & { status?: "pending" | "claimed" };
export type CreateMessageRequest = InsertMessage;

export interface ItemsQueryParams {
  search?:   string;
  category?: string;
  type?:     "lost" | "found";
  status?:   "pending" | "claimed";
}

// Stub exports so existing import { items, messages } from "@shared/schema" still compiles
export const items   = {} as any;
export const messages = {} as any;
export const users   = {} as any;
