import { IsNotEmpty, IsString } from "class-validator";

export class CreateAuthDto {
  @IsNotEmpty()
  @IsString()
  readonly login: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;
}