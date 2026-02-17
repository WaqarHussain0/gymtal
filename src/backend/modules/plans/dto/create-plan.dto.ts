import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ArrayNotEmpty, Min } from "class-validator";

export class CreatePlanDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  duration!: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price!: number;

  @IsOptional()
  @IsNumber()
  members?: number;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  features?: string[];
}
