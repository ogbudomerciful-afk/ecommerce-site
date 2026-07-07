import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || "";

type MongooseCache = {
  conn: mongoose.Mongoose | null;
  promise: Promise<mongoose.Mongoose> | null;
};

const globalCache = globalThis as typeof globalThis & {
  mongooseCache?: MongooseCache;
};

const cache =
  globalCache.mongooseCache ??
  (globalCache.mongooseCache = {
    conn: null,
    promise: null,
  });

export async function connectToDatabase() {
  if (cache.conn) {
    return cache.conn;
  }

  if (!MONGO_URI) {
    cache.conn = mongoose as unknown as mongoose.Mongoose;
    return cache.conn;
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGO_URI, {
      bufferCommands: false,
    });
  }

  try {
    cache.conn = await cache.promise;
    return cache.conn;
  } catch (error) {
    console.warn("MongoDB connection unavailable, continuing in demo mode", error);
    cache.conn = mongoose as unknown as mongoose.Mongoose;
    return cache.conn;
  }
}

export default connectToDatabase;
