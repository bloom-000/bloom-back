import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import * as cookieParser from 'cookie-parser';
import { setupSwagger } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  setupSwagger(app);
  await app.listen(3000);
}

bootstrap();
