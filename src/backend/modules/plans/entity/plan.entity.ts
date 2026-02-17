import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPlan extends Document {
  name: string;
  duration: number;
  price: number;
  members?: number;
  features?: string[];
}

const PlanSchema: Schema<IPlan> = new Schema<IPlan>(
  {
    name: { type: String, required: true, unique: true },
    duration: { type: Number, required: true },
    price: { type: Number, required: true },
    members: { type: Number, default: 0 },
    features: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const PlanEntity: Model<IPlan> = mongoose.models.Plan || mongoose.model<IPlan>("Plan", PlanSchema);

export default PlanEntity;
