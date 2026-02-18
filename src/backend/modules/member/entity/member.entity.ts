import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMember extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  enrolledDate: string;
  expiryDate: string; 
  feePaid: number;
}

const MemberSchema: Schema<IMember> = new Schema<IMember>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    enrolledDate: { type: String, required: true },
    expiryDate: { type: String, required: true },
    feePaid: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

// Cascade delete: If plan is deleted, remove members with that plan
MemberSchema.pre("remove", async function (next) {
  // No-op: handled in Plan deletion logic
  next();
});

const MemberEntity: Model<IMember> =
  mongoose.models.Member || mongoose.model<IMember>("Member", MemberSchema);

export default MemberEntity;
