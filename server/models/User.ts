import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    id:              { type: String, unique: true, sparse: true },
    email:           { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:        { type: String, required: true },
    firstName:       { type: String, required: true, trim: true },
    lastName:        { type: String, default: "" },
    profileImageUrl: { type: String, default: null },
    role:            { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  // Set string id from _id
  if (!this.id) this.id = (this._id as any).toHexString();
  // Hash password if changed
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password as string, 12);
  }
  next();
});

userSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.password as string);
};

export const User = mongoose.model("User", userSchema);
