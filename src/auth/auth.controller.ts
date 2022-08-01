import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/signup')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(201)
  async signup(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signup(createUserDto);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  async login(@Request() req) {
    return await this.authService.login(req.user);
  }

  @Public()
  @Post('/refresh')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  async refresh(@Request() req) {
    return await this.authService.refresh(req.body);
  }
}
