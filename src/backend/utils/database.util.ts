import mongoose from "mongoose";
import UserEntity from "@/backend/modules/user/entity/user.entity";
import MemberEntity from "@/backend/modules/member/entity/member.entity";


const MONGODB_URI = process.env.NEXT_PUBLIC_MONGODB_URI||"mongodb://localhost:27017/gymtal";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env");
}

/**
 * Global is used to maintain a cached connection across hot reloads in development
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

// All your models go here
const models = {
  User: UserEntity,
  Member: MemberEntity,
};

async function connectToDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then(async (mongooseInstance) => {
      console.log("MongoDB connected ✅");

      // Sync indexes for all models
      await Promise.all(
        Object.values(models).map(async (model) => {
          if (!model) return;
          await model.syncIndexes(); // ensures unique/indexes are applied
        })
      );

      console.log("All model indexes synced ✅");

      return mongooseInstance;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDB;
