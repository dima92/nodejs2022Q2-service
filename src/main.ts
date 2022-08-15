import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { cwd } from 'process';
import { parse } from 'yaml';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config({ path: resolve(cwd(), '.env') });

async function bootstrap() {
  const port = process.env.PORT || 4000;
  const app = await NestFactory.create(AppModule);

  const document = await readFile(resolve(cwd(), 'doc', 'api.yaml'), {
    encoding: 'utf8',
  });

  app
    .useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))
    .useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );

  SwaggerModule.setup('doc', app, parse(document));
  await app.listen(port);
}
bootstrap();
