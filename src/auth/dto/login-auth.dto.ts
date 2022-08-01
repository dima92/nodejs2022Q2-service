import { PartialType } from '@nestjs/swagger';
import { CreateAuthDto } from './create-auth.dto';

export class LoginAuthDto extends PartialType(CreateAuthDto) {}