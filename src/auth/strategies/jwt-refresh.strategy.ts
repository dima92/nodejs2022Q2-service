import { UserService } from '../../user/user.service';
import { ConfigService } from '@nestjs/config';
import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { JwtService } from '@nestjs/jwt';

const bodyExtractor = (req: Request, jwtService: JwtService): string => {
  if (!req.body) {
    throw new UnauthorizedException({
      status: HttpStatus.UNAUTHORIZED,
      message: 'Invalid body',
    });
  }

  const token = jwtService.decode(req.body['refreshToken']);
  if (Date.now() >= token['exp'] * 1000) {
    throw new ForbiddenException({
      status: HttpStatus.FORBIDDEN,
      message: 'Token expired',
    });
  }

  return req.body['refreshToken'];
};

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    private userService: UserService,
    config: ConfigService,
    private jwtService: JwtService,
  ) {
    super({
      jwtFromRequest: (req: Request) => bodyExtractor(req, jwtService),
      secretOrKey: config.get('JWT_SECRET_REFRESH_KEY'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: { userId: string; login: string }) {
    console.log(payload.userId);

    return await this.userService.findOne(payload.userId);
  }
}
