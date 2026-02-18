import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string | null;
  role: string;
  phone: string;
  gender: string;
}

const UserSchema: Schema<IUser> = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
    password: { type: String, required: false, default: null },
    role: { type: String, required: true, default: "member" },
    phone: { type: String, required: false, default: null },
    gender: { type: String, required: false, default: null },
  },
  {
    timestamps: true,
  }
);

// Prevent model overwrite issue in Next.js hot reload
const UserEntity: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default UserEntity;
