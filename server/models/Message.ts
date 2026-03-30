import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    id:      { type: String, unique: true, sparse: true },
    name:    { type: String, required: true },
    email:   { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

messageSchema.pre("save", function (next) {
  if (!this.id) this.id = (this._id as any).toHexString();
  next();
});

export const Message = mongoose.model("Message", messageSchema);
