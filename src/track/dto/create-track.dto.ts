import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';
import { isNull } from 'lodash';

export class CreateTrackDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @ValidateIf((_, value) => !isNull(value))
  @IsUUID()
  artistId: string | null;

  @ValidateIf((_, value) => !isNull(value))
  @IsUUID()
  albumId: string | null;

  @IsNumber()
  @IsNotEmpty()
  duration: number;
}
