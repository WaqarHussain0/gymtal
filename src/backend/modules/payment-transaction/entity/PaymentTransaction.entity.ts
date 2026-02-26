import mongoose, { Schema, Document, Model } from "mongoose";
import autopopulate from "mongoose-autopopulate";

export type PaymentMethod = "cash";

export interface IPaymentTransaction extends Document {
  userId: mongoose.Types.ObjectId; // member
  membershipPeriodId: mongoose.Types.ObjectId;
  amount: number;
  paymentMethod: PaymentMethod;
  receivedBy: mongoose.Types.ObjectId; // staff/admin
  paymentDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentTransactionSchema: Schema<IPaymentTransaction> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    membershipPeriodId: {
      type: Schema.Types.ObjectId,
      ref: "MembershipPeriod",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentMethod: {
      type: String,
      enum: ["cash"],
      default: "cash",
    },

    receivedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
      autopopulate: true,
    },

    paymentDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true },
);

// 👇 Enable plugin
PaymentTransactionSchema.plugin(autopopulate);

const PaymentTransactionEntity: Model<IPaymentTransaction> =
  mongoose.models.PaymentTransaction ||
  mongoose.model<IPaymentTransaction>(
    "PaymentTransaction",
    PaymentTransactionSchema,
  );

export default PaymentTransactionEntity;
