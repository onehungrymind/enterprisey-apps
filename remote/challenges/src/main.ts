import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const configureSwagger = (app) => {
  const options = new DocumentBuilder()
    .setTitle('Dashboard Api')
    .setDescription('API for Dashboard')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  const port = process.env.PORT || 3100;

  app.enableCors();
  app.setGlobalPrefix(globalPrefix);

  configureSwagger(app);

  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap();
