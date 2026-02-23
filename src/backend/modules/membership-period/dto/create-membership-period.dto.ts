import { IsNotEmpty, IsDate, IsString } from "class-validator";
import mongoose from "mongoose";

export class CreateMembershipPeriodDto {
    @IsNotEmpty()
    userId!: mongoose.Types.ObjectId;

    @IsNotEmpty()
    @IsDate()
    startDate!: Date;

    @IsNotEmpty()
    @IsDate()
    endDate!: Date;

    @IsNotEmpty()
    @IsString()
    createdBy!: string;
}