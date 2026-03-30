// Local auth user type (replaces Replit/Drizzle auth model)
export type User = {
  id:              string;
  email:           string;
  firstName:       string;
  lastName:        string;
  profileImageUrl: string | null;
  role?:           string;
  createdAt?:      Date;
  updatedAt?:      Date;
};

export type UpsertUser = Partial<User>;

// Stub so any remaining `import { users } from "@shared/models/auth"` compiles
export const users    = {} as any;
export const sessions = {} as any;
