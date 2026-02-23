import mongoose, { Schema, Document, Model } from "mongoose";
import autopopulate from "mongoose-autopopulate";


export interface IMembershipPeriod extends Document {
    userId: mongoose.Types.ObjectId; // member
    startDate: Date;
    endDate: Date;
    createdBy: mongoose.Types.ObjectId; // admin/staff
    createdAt: Date;
    updatedAt: Date;
}

const MembershipPeriodSchema: Schema<IMembershipPeriod> = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        startDate: {
            type: Date,
            required: true,
        },

        endDate: {
            type: Date,
            required: true,
        },


        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
            autopopulate: true
        },


    },
    { timestamps: true }
);

/**
 * Compound index to quickly find active membership
 */
MembershipPeriodSchema.index({ userId: 1, startDate: 1, endDate: 1 });

// 👇 Enable plugin
MembershipPeriodSchema.plugin(autopopulate);
const MembershipPeriodEntity: Model<IMembershipPeriod> =
    mongoose.models.MembershipPeriod ||
    mongoose.model<IMembershipPeriod>(
        "MembershipPeriod",
        MembershipPeriodSchema
    );

export default MembershipPeriodEntity;
