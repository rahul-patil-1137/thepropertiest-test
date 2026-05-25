import mongoose from "mongoose";
import { env } from "./env.js";

const MONGODB_URI = env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is missing");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = {
    conn: null,
    promise: null,
  };
}

export const connectDB = async (): Promise<void> => {
  try {
    if (cached.conn) {
      console.log("✅ Using existing MongoDB connection");
      return;
    }

    if (!cached.promise) {
      cached.promise = mongoose.connect(MONGODB_URI, {
        bufferCommands: false,
      });
    }

    cached.conn = await cached.promise;

    console.log(
      `✅ MongoDB connected: ${cached.conn.connection.host}`
    );
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
};