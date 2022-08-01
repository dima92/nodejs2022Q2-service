import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshAuthDto {
  @IsNotEmpty()
  @IsString()
  readonly refreshToken: string;
}
