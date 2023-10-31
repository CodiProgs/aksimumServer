import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as CookieParser from 'cookie-parser';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.enableCors({
    origin: true, //process.env.CLIENT_URL
    credentials: true,
    allowedHeaders: [
      'Accept',
      'Authorization',
      'Content-Type',
      'X-Requested-With',
      'apollo-require-preflight',
    ],
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  })
  app.use(CookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => {
        const formattedErrors = errors.reduce((acc, err) => {
          acc[err.property] = Object.values(err.constraints).join(
            ', ',
          )
          return acc;
        }, {});
        throw new BadRequestException(formattedErrors);
      }
    })
  )
  await app.listen(process.env.PORT, '0.0.0.0');
}
bootstrap();
