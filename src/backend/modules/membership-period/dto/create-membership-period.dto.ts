import { IsNotEmpty, IsDate, IsString } from "class-validator";

export class CreateMembershipPeriodDto {
    @IsNotEmpty()
    userId!: string;

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