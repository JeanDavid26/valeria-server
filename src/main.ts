import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { useContainer } from 'class-validator';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // supprime les propriétés non décorées
      forbidNonWhitelisted: true, // throw si propriété inconnue
      transform: true, // cast automatique des types
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
