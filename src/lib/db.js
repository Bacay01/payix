import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.warn(
    "MONGODB_URI is not set. Add it to .env.local to enable database access."
  );
}

const cached = global._mongoose ?? { conn: null, promise: null };
global._mongoose = cached;

export async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  if (!MONGODB_URI) {
    throw new Error(
      "MONGODB_URI is not set. Add it to your .env.local file, e.g. MONGODB_URI=mongodb://127.0.0.1:27017/payix"
    );
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}