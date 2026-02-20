import { IsNotEmpty, IsString, IsNumber, IsDate } from "class-validator";


export class CreatePaymentDto {
    @IsNotEmpty()
    @IsString()
    userId!: string;

    @IsNotEmpty()
    @IsString()
    membershipPeriodId!: string;

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