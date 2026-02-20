// dto/create-user.dto.ts

import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
  MinLength,
} from "class-validator";
import { Transform } from "class-transformer";
import { GenderEnum, UserRoleEnum } from "../entity/user.entity";

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: { value: string }) => value.trim())
  name!: string;

  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }: { value: string }) => value.toLowerCase().trim())
  email!: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string | null;

  @IsOptional()
  @IsEnum(UserRoleEnum)
  role?: UserRoleEnum;

  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: string }) => value?.trim())
  phone?: string | null;

  @IsOptional()
  @IsEnum(GenderEnum)
  gender?: GenderEnum | null;
}
