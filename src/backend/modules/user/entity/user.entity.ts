import mongoose, { Schema, Document, Model } from "mongoose";

export enum UserRoleEnum {
  ADMIN = "admin",
  STAFF = "staff",
  MEMBER = "member",
}

export enum GenderEnum {
  MALE = "male",
  FEMALE = "female",
}

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string | null;
  role: UserRoleEnum;
  phone: string;
  gender: GenderEnum | null;
  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
    password: { type: String, required: false, default: null },
    role: {
      type: String,
      enum: UserRoleEnum,
      default: UserRoleEnum.MEMBER,
    },
    phone: { type: String, required: false, default: null },
    gender: { type: String, enum: GenderEnum, required: false, default: null },
    resetPasswordToken: { type: String, required: false, default: null },
    resetPasswordExpires: { type: Date, required: false, default: null },
  },
  {
    timestamps: true,
  }
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

// Make sure virtuals are included in JSON
UserSchema.set("toJSON", { virtuals: true });
UserSchema.set("toObject", { virtuals: true });


// Prevent model overwrite issue in Next.js hot reload
const UserEntity: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default UserEntity;
