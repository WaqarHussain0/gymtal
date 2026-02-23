import mongoose, { Schema, Model } from "mongoose";

export enum UserRoleEnum {
  ADMIN = "admin",
  STAFF = "staff",
  MEMBER = "member",
}

export enum GenderEnum {
  MALE = "male",
  FEMALE = "female",
}

export interface IUser {
  name: string;
  email: string;
  password?: string | null;
  role: UserRoleEnum;
  phone: string;
  gender: GenderEnum | null;
  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;
  isActive?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
    password: { type: String, default: null },
    role: {
      type: String,
      enum: UserRoleEnum,
      default: UserRoleEnum.MEMBER,
    },
    phone: { type: String, default: null },
    gender: { type: String, enum: GenderEnum, default: null },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
  },
  { timestamps: true }
);

UserSchema.virtual("membershipPeriods", {
  ref: "MembershipPeriod",
  localField: "_id",
  foreignField: "userId",
});

UserSchema.virtual("paymentTransactions", {
  ref: "PaymentTransaction",
  localField: "_id",
  foreignField: "userId",
});

UserSchema.set("toJSON", { virtuals: true });
UserSchema.set("toObject", { virtuals: true });

const UserEntity: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default UserEntity;