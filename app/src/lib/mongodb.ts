import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || "";

const cache = globalThis as typeof globalThis & {
  mongooseCache?: { conn: mongoose.Mongoose | null; promise?: Promise<mongoose.Mongoose> };
};

if (!cache.mongooseCache) {
  cache.mongooseCache = { conn: null };
}

export async function connectToDatabase() {
  if (cache.mongooseCache?.conn) {
    return cache.mongooseCache.conn;
  }

  if (!MONGO_URI) {
    cache.mongooseCache!.conn = mongoose as unknown as mongoose.Mongoose;
    return cache.mongooseCache!.conn;
  }

  if (!cache.mongooseCache?.promise) {
    cache.mongooseCache.promise = mongoose.connect(MONGO_URI, {
      bufferCommands: false,
    } as mongoose.ConnectOptions);
  }

  try {
    cache.mongooseCache.conn = await cache.mongooseCache.promise;
    return cache.mongooseCache.conn;
  } catch (error) {
    console.warn("MongoDB connection unavailable, continuing in demo mode", error);
    cache.mongooseCache.conn = mongoose as unknown as mongoose.Mongoose;
    return cache.mongooseCache.conn;
  }
}

export default connectToDatabase;
