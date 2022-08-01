import { RequestWithUser } from './requestWithUser.interface';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import {
  Controller,
  Post,
  Body,
  Header,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpCode,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(201)
  @Header('Content-Type', 'application/json')
  @UseInterceptors(ClassSerializerInterceptor)
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @HttpCode(200)
  @Post('login')
  @Header('Content-Type', 'application/json')
  @UseInterceptors(ClassSerializerInterceptor)
  login(@Body() loginAuthDto: LoginAuthDto, @Req() request: any) {
    return this.authService.login(loginAuthDto);
  }

  @HttpCode(200)
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @Header('Content-Type', 'application/json')
  @UseInterceptors(ClassSerializerInterceptor)
  refreshToken(@Req() req: RequestWithUser) {
    const user = req.user;
    return this.authService.getTokens(user.id, user.login);
  }
}
