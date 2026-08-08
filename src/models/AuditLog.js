import { Schema, model, models } from "mongoose";

const AuditLogSchema = new Schema(
  {
    admin: { type: Schema.Types.ObjectId, ref: "User", required: true },
    adminName: { type: String, required: true },
    action: { type: String, required: true },
    targetUser: { type: Schema.Types.ObjectId, ref: "User" },
    details: { type: String, default: "" },
  },
  { timestamps: true }
);

export const AuditLog = models.AuditLog || model("AuditLog", AuditLogSchema);