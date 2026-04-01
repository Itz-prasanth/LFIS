import mongoose from "mongoose";
import { User } from "../models/User";

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb://localhost:27017/lfis";

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL || "admin@lostandfound.local";
  const password = process.env.ADMIN_PASSWORD || "Admin@1234";
  const existing = await User.findOne({ email });
  if (!existing) {
    const admin = new User({ firstName: "Admin", email, password, role: "admin" });
    await admin.save();
    console.log("✅ Admin user created:", email);
  }
}

export async function connectDB() {
  await mongoose.connect(MONGO_URI);
  console.log("✅ MongoDB connected");
  await seedAdmin();
}