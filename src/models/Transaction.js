import { Schema, model, models } from "mongoose";

const TransactionSchema = new Schema(
  {
    account: { type: Schema.Types.ObjectId, ref: "Account", required: true },
    type: { type: String, enum: ["income", "expense", "transfer"], required: true },
    category: { type: String, required: true, default: "General" },
    amount: { type: Number, required: true },
    description: { type: String, default: "" },
    occurredAt: { type: Date, default: Date.now },
    frozen: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Transaction = models.Transaction || model("Transaction", TransactionSchema);