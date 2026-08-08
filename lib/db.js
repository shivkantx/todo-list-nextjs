import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MongoDB URI environment variable");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
  };
}

async function connectDB() {
  if (cached.conn) {
    console.log("✅ MongoDB is already connected.");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("🔄 Connecting to MongoDB...");
    cached.promise = mongoose.connect(MONGODB_URI);
  }

  try {
    cached.conn = await cached.promise;

    console.log("🎉 Successfully connected to MongoDB!");
    console.log(`📂 Database: ${cached.conn.connection.name}`);
    console.log(`🌐 Host: ${cached.conn.connection.host}`);

    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.error("❌ Failed to connect to MongoDB");
    console.error(error.message);
    throw error;
  }
}

export default connectDB;
