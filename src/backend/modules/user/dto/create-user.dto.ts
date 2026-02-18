// dto/create-user.dto.ts
import { IsEmail, IsNotEmpty, IsOptional, IsString,  } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  password?: string | null;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  phone?: string | null;

  @IsOptional()
  @IsString()
  gender?: string | null;
}
