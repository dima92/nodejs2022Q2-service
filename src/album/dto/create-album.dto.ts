import {
  IsNotEmpty,
  IsNumber,
  IsString,
  isUUID,
  IsUUID,
  ValidateIf,
} from 'class-validator';

export class CreateAlbumDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  year: number;

  @ValidateIf((_, value) => isUUID(value, '4'))
  @IsUUID('4')
  artistId?: string | null;
}
