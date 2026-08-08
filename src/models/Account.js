import { Schema, model, models } from "mongoose";

const AccountSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, default: "Main Account" },
    currency: { type: String, required: true, default: "USD" },
    balance: { type: Number, required: true, default: 0 },
    frozen: { type: Boolean, default: false },
    frozenReason: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Account = models.Account || model("Account", AccountSchema);