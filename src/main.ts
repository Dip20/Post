import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // enable dto parsing

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,        // strips unknown properties
    forbidNonWhitelisted: true, // throws error if extra properties
    transform: true,        // auto-transform payload to DTO class
  }));

  app.useGlobalFilters(new AllExceptionsFilter());
  // add cros
  app.enableCors({
    origin: '*',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
  });
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
