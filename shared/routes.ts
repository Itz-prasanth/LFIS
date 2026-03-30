import { z } from "zod";
import { insertItemSchema, insertMessageSchema, items, messages } from "./schema";
import { users } from "./models/auth";

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

export const api = {
  items: {
    list: {
      method: 'GET' as const,
      path: '/api/items' as const,
      input: z.object({
        search: z.string().optional(),
        category: z.string().optional(),
        type: z.enum(["lost", "found"]).optional(),
        status: z.enum(["pending", "claimed"]).optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof items.$inferSelect & { author: typeof users.$inferSelect }>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/items/:id' as const,
      responses: {
        200: z.custom<typeof items.$inferSelect & { author: typeof users.$inferSelect }>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/items' as const,
      input: insertItemSchema,
      responses: {
        201: z.custom<typeof items.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/items/:id' as const,
      input: insertItemSchema.partial().extend({ status: z.enum(["pending", "claimed"]).optional() }),
      responses: {
        200: z.custom<typeof items.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
        403: errorSchemas.unauthorized, // Forbidden
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/items/:id' as const,
      responses: {
        204: z.void(),
        401: errorSchemas.unauthorized,
        403: errorSchemas.unauthorized, // Forbidden
        404: errorSchemas.notFound,
      },
    }
  },
  messages: {
    create: {
      method: 'POST' as const,
      path: '/api/messages' as const,
      input: insertMessageSchema,
      responses: {
        201: z.custom<typeof messages.$inferSelect>(),
        400: errorSchemas.validation,
      },
    }
  },
  stats: {
    get: {
      method: 'GET' as const,
      path: '/api/stats' as const,
      responses: {
        200: z.object({
          totalLost: z.number(),
          totalFound: z.number(),
          totalClaimed: z.number(),
          totalUsers: z.number(),
        }),
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type ItemResponse = z.infer<typeof api.items.get.responses[200]>;
export type ItemsListResponse = z.infer<typeof api.items.list.responses[200]>;
export type StatsResponse = z.infer<typeof api.stats.get.responses[200]>;
