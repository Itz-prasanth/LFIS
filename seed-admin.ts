/**
 * seed-admin.ts
 * Run once to create (or promote) an admin user.
 *
 * Usage:
 *   npx tsx seed-admin.ts
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

// Manually load .env (no dotenv dependency needed)
try {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const envFile = readFileSync(join(__dirname, ".env"), "utf-8");
  for (const line of envFile.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = val;
  }
} catch { /* .env not found, rely on system env */ }

const ADMIN_EMAIL     = process.env.ADMIN_EMAIL    || "admin@lostandfound.local";
const ADMIN_PASSWORD  = process.env.ADMIN_PASSWORD || "Admin@1234";
const ADMIN_FIRSTNAME = "Admin";

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set in .env");

  await mongoose.connect(uri);
  console.log("Connected to MongoDB");

  const userSchema = new mongoose.Schema({
    id:              { type: String, unique: true, sparse: true },
    email:           { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:        { type: String, required: true },
    firstName:       { type: String, required: true, trim: true },
    lastName:        { type: String, default: "" },
    profileImageUrl: { type: String, default: null },
    role:            { type: String, enum: ["user", "admin"], default: "user" },
  }, { timestamps: true });

  userSchema.pre("save", async function (next) {
    if (!this.id) this.id = (this._id as any).toHexString();
    if (this.isModified("password"))
      this.password = await bcrypt.hash(this.password as string, 12);
    next();
  });

  const User = mongoose.models.User || mongoose.model("User", userSchema);

  const existing = await User.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    if (existing.role !== "admin") {
      await User.updateOne({ email: ADMIN_EMAIL }, { role: "admin" });
      console.log(`Promoted existing user "${ADMIN_EMAIL}" to admin.`);
    } else {
      console.log(`Admin user "${ADMIN_EMAIL}" already exists.`);
    }
  } else {
    const admin = new User({
      firstName: ADMIN_FIRSTNAME,
      email:     ADMIN_EMAIL,
      password:  ADMIN_PASSWORD,
      role:      "admin",
    });
    await admin.save();
    console.log(`Admin user created!`);
    console.log(`Email   : ${ADMIN_EMAIL}`);
    console.log(`Password: ${ADMIN_PASSWORD}`);
    console.log(`Change this password after first login!`);
  }

  await mongoose.disconnect();
}

main().catch(err => { console.error(err); process.exit(1); });
