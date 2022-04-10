import { INestApplication } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';

export const setupSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('eCom API')
    .setDescription('eCom API Docs')
    .setVersion('1.0')
    .addCookieAuth('access_token')
    .build();

  const options: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
    },
  };

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, options);
};
