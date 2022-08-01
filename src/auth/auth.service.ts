import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  signup = async (createUserDto: CreateUserDto) => {
    return await this.userService.create(createUserDto);
  };

  validateUser = async (login: string, password: string) => {
    const user = await this.userService.findByLogin(login);
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    return user;
  };

  login = async (user: User) => {
    const { id, login } = user;
    const accessToken = await this.jwtService.signAsync(
      { userId: id, login },
      {
        secret: process.env.JWT_SECRET_KEY,
        expiresIn: process.env.TOKEN_EXPIRE_TIME,
      },
    );
    const refreshToken = await this.jwtService.signAsync(
      { userId: id, login },
      {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
        expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
      },
    );
    return { accessToken, refreshToken };
  };

  refresh = async (body: { refreshToken: string }) => {
    const { refreshToken } = body;
    if (!refreshToken) {
      throw new UnauthorizedException({
        statusCode: 401,
        message: 'No refresh token in body',
        error: 'Unauthorized',
      });
    }

    try {
      const { userId, login } = this.jwtService.verify(refreshToken);
      const user = new User({ id: userId, login });
      return await this.login(user);
    } catch {
      throw new ForbiddenException({
        statusCode: 403,
        message: 'Refresh token is outdated or invalid',
        error: 'Forbidden',
      });
    }
  };
}
