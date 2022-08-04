import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggingService } from './logging.service';
import { hash } from 'bcrypt';
import { config } from 'dotenv';

config();
const salt = process.env.CRYPT_SALT || 10;

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const logger = new LoggingService(req.url.slice(1).split('/')[0]);
    const { body, method, originalUrl, query } = req;

    res.on('finish', async () => {
      const { statusCode } = res;

      if (body.password) {
        body.password = await hash(String(body.password), Number(salt));
      }

      logger.log(
        `${method} ${originalUrl} ${statusCode} - body: ${JSON.stringify(
          body,
        )} query params: ${JSON.stringify(query)}`,
      );
    });

    next();
  }
}
