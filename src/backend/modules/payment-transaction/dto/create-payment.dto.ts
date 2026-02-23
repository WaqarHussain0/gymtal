import { IsNotEmpty, IsString, IsNumber, IsDate } from "class-validator";
import mongoose from "mongoose";


export class CreatePaymentDto {
    @IsNotEmpty()
    @IsString()
    userId!: mongoose.Types.ObjectId;

    @IsNotEmpty()
    @IsString()
    membershipPeriodId!: mongoose.Types.ObjectId;

    @IsNotEmpty()
    @IsNumber()
    amount!: number;

    @IsNotEmpty()
    @IsString()
    paymentMethod!: 'cash';

    @IsNotEmpty()
    @IsString()
    receivedBy!: string;

    @IsNotEmpty()
    @IsDate()
    paymentDate!: Date;

}