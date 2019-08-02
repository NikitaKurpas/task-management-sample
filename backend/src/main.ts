import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import config from 'config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      disableErrorMessages: process.env.NODE_ENV !== 'development',
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(new Reflector()));
  await app.listen(config.get('port'));
}
bootstrap();
