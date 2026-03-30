import { Item } from "./models/Item";
import { User } from "./models/User";
import { Message } from "./models/Message";

export class DatabaseStorage {
  // ── Items ────────────────────────────────────────────────────────────────
  async getItems(params?: {
    search?: string; category?: string;
    type?: "lost" | "found"; status?: "pending" | "claimed";
  }) {
    const query: any = {};
    if (params?.type)     query.type = params.type;
    if (params?.status)   query.status = params.status;
    if (params?.category) query.category = { $regex: params.category, $options: "i" };
    if (params?.search) {
      query.$or = [
        { title:       { $regex: params.search, $options: "i" } },
        { description: { $regex: params.search, $options: "i" } },
      ];
    }

    const items = await Item.find(query).sort({ createdAt: -1 }).lean();

    // Attach author
    return Promise.all(
      items.map(async (item) => {
        const author = await User.findOne({ id: item.userId }).select("-password").lean();
        return { ...item, author };
      })
    );
  }

  async getItem(id: string) {
    const item = await Item.findOne({ id }).lean();
    if (!item) return undefined;
    const author = await User.findOne({ id: item.userId }).select("-password").lean();
    return { ...item, author };
  }

  async createItem(data: any) {
    const item = new Item(data);
    await item.save();
    return item.toObject();
  }

  async updateItem(id: string, updates: any) {
    const item = await Item.findOneAndUpdate({ id }, updates, { new: true }).lean();
    return item ?? undefined;
  }

  async deleteItem(id: string) {
    const result = await Item.deleteOne({ id });
    return result.deletedCount > 0;
  }

  // ── Messages ─────────────────────────────────────────────────────────────
  async createMessage(data: any) {
    const msg = new Message(data);
    await msg.save();
    return msg.toObject();
  }

  // ── Stats ─────────────────────────────────────────────────────────────────
  async getStats() {
    const [totalLost, totalFound, totalClaimed, totalUsers] = await Promise.all([
      Item.countDocuments({ type: "lost" }),
      Item.countDocuments({ type: "found" }),
      Item.countDocuments({ status: "claimed" }),
      User.countDocuments(),
    ]);
    return { totalLost, totalFound, totalClaimed, totalUsers };
  }

  // ── Admin ─────────────────────────────────────────────────────────────────
  async getAllUsers() {
    return User.find().select("-password").sort({ createdAt: -1 }).lean();
  }

  async deleteUserById(id: string) {
    const result = await User.deleteOne({ id });
    return result.deletedCount > 0;
  }

  async getAllMessages() {
    return Message.find().sort({ createdAt: -1 }).lean();
  }

  async deleteMessage(id: string) {
    const result = await Message.deleteOne({ id });
    return result.deletedCount > 0;
  }

  async adminUpdateItem(id: string, updates: any) {
    return Item.findOneAndUpdate({ id }, updates, { new: true }).lean();
  }

  async adminDeleteItem(id: string) {
    const result = await Item.deleteOne({ id });
    return result.deletedCount > 0;
  }
}

export const storage = new DatabaseStorage();
