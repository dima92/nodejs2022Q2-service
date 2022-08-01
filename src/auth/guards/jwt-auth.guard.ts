import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';

export const Public = () => SetMetadata(process.env.IS_PUBLIC_KEY, true);

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      process.env.IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
}
