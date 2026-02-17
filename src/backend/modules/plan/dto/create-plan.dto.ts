import {
  IsArray,
  ArrayNotEmpty,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from "class-validator";

export class CreatePlanDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  duration!: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price!: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  features!: string[];
}

