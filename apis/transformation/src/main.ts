import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const configureSwagger = (app) => {
  const options = new DocumentBuilder()
    .setTitle('Transformation Api')
    .setDescription('API for Data Pipeline Management and Transformation')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  const port = process.env.PORT || 3200;

  app.enableCors();
  app.setGlobalPrefix(globalPrefix);

  configureSwagger(app);

  await app.listen(port);
  Logger.log(
    `Transformation API running on: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap();
