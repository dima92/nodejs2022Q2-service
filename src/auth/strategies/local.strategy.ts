import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthService } from "../auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'login', passwordField: 'password' });
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new ForbiddenException({
        statusCode: 403,
        message: 'No user with such login, password was found',
        error: 'Forbidden',
      });
    }
    return user;
  }
}
