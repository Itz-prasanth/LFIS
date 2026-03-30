import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    id:          { type: String, unique: true, sparse: true },
    title:       { type: String, required: true },
    description: { type: String, required: true },
    category:    { type: String, required: true },
    type:        { type: String, enum: ["lost", "found"], required: true },
    location:    { type: String, required: true },
    date:        { type: Date, required: true },
    imageUrl:    { type: String, default: null },
    status:      { type: String, enum: ["pending", "claimed"], default: "pending" },
    userId:      { type: String, required: true },
    contactInfo: { type: String, required: true },
  },
  { timestamps: true }
);

itemSchema.pre("save", function (next) {
  if (!this.id) this.id = (this._id as any).toHexString();
  next();
});

export const Item = mongoose.model("Item", itemSchema);
