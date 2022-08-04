import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingService implements NestMiddleware {
  constructor(string: string) {}

  private logger = new Logger('http');

  use(req: Request, res: Response, next: NextFunction): void {
    const { body, method, originalUrl, query } = req;

    res.on('finish', () => {
      const { statusCode } = res;

      this.logger.log(
        `${method}${originalUrl}${statusCode} - body: ${JSON.stringify(
          body,
        )} query params: ${JSON.stringify(query)}`,
      );
    });

    next();
  }

  error(message: string, stack: string) {}
}
