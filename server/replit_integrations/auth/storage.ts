import { User } from "../../models/User";

export interface IAuthStorage {
  getUser(id: string): Promise<any | undefined>;
  upsertUser(user: any): Promise<any>;
}

class AuthStorage implements IAuthStorage {
  async getUser(id: string) {
    return User.findOne({ id }).select("-password").lean();
  }
  async upsertUser(userData: any) {
    return User.findOneAndUpdate({ id: userData.id }, userData, { upsert: true, new: true }).lean();
  }
}

export const authStorage = new AuthStorage();
