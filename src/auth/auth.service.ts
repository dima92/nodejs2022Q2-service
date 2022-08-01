import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private configService: ConfigService,
  ) {}

  async create(createAuthDto: CreateAuthDto) {
    return await this.userService.create(createAuthDto);
  }

  async login(loginAuthDto: LoginAuthDto) {
    const user = await this.validateUser(loginAuthDto.login);
    await this.verifyPassword(loginAuthDto.password, user.password);
    return await this.getTokens(user.id, loginAuthDto.login);
  }

  async getTokens(id: string, login: string) {
    const accessToken = this.getAccessToken(id, login);
    const refreshToken = this.getRefreshToken(id, login);
    await this.userService.setRefreshToken(id, refreshToken.refreshToken);

    return {
      ...accessToken,
      ...refreshToken,
    };
  }

  async refresh(id: string, login: string) {
    return await this.getTokens(id, login);
  }

  getAccessToken(userId: string, login: string) {
    const payload = { userId, login };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET_KEY'),
      expiresIn: `${this.configService.get('TOKEN_EXPIRE_TIME')}`,
    });
    return {
      accessToken: token,
    };
  }

  getRefreshToken(userId: string, login: string) {
    const payload = { userId, login };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET_REFRESH_KEY'),
      expiresIn: `${this.configService.get('TOKEN_REFRESH_EXPIRE_TIME')}`,
    });
    return {
      refreshToken: token,
    };
  }

  async verifyPassword(loginPass: string, userPass: string) {
    const match = await bcrypt.compare(loginPass, userPass);
    if (!match) {
      throw new ForbiddenException({
        status: HttpStatus.FORBIDDEN,
        message: 'Wrong credentials',
      });
    }
  }

  async validateUser(login: string) {
    return await this.userService.findByLogin(login);
  }
}
