import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateMemberDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  phone!: string;

  @IsNotEmpty()
  @IsString()
  gender: string;

  @IsNotEmpty()
  @IsString()
  enrolledDate: string  ;

  @IsNotEmpty()
  @IsString()
  expiryDate: string;
  
  @IsNotEmpty()
  @IsNumber()
  feePaid: number;
}
