import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const [, , email, password, name = "Payix Admin"] = process.argv;

if (!email || !password) {
  console.error('Usage: node --env-file=.env.local scripts/create-admin.mjs "email" "password" "Full Name"');
  process.exit(1);
}
if (password.length < 12) {
  console.error("Use at least 12 characters for an admin password.");
  process.exit(1);
}

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true, lowercase: true },
    passwordHash: String,
    accountType: { type: String, default: "personal" },
    role: { type: String, default: "user" },
  },
  { timestamps: true }
);
const User = mongoose.models.User || mongoose.model("User", UserSchema);

await mongoose.connect(process.env.MONGODB_URI);

const passwordHash = await bcrypt.hash(password, 10);
const normalized = email.toLowerCase().trim();

const existing = await User.findOne({ email: normalized });
if (existing) {
  existing.role = "admin";
  existing.passwordHash = passwordHash;
  await existing.save();
  console.log(`Promoted existing user ${normalized} to admin and reset password.`);
} else {
  await User.create({ name, email: normalized, passwordHash, role: "admin" });
  console.log(`Created admin ${normalized}.`);
}

await mongoose.disconnect();