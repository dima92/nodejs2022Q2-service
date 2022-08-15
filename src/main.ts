import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { cwd } from 'process';
import { parse } from 'yaml';
import { AppModule } from './app.module';
import 'dotenv/config';
import { HttpExceptionFilter } from './utils/exception.filter';
import { LoggingService } from './utils/logging.service';

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  const document = await readFile(resolve(cwd(), 'doc', 'api.yaml'), {
    encoding: 'utf8',
  });
  SwaggerModule.setup('doc', app, parse(document));

  process.on('uncaughtExceptionMonitor', (error: Error) => {
    const logger = new LoggingService('unhandledRejection');
    logger.error(`Captured error: ${error.message}`, error.stack);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason: Error, promise) => {
    const logger = new LoggingService('unhandledRejection');
    logger.error(
      `Unhandled Rejection at Promise: ${reason.message}`,
      reason.stack,
    );
    process.exit(1);
  });

  process.removeAllListeners('uncaughtException');
  process.removeAllListeners('unhandledRejection');

  await app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

bootstrap();
