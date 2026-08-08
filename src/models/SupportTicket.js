import { Schema, model, models } from "mongoose";

const SupportTicketSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reference: { type: String, required: true, unique: true },
    subject: { type: String, required: true },
    category: { type: String, required: true, default: "General" },
    message: { type: String, required: true },
    status: { type: String, enum: ["open", "in_progress", "resolved"], default: "open" },
  },
  { timestamps: true }
);

export const SupportTicket =
  models.SupportTicket || model("SupportTicket", SupportTicketSchema);