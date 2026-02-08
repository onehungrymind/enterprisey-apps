import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as fs from 'fs';

import { AppModule } from './app/app.module';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const configureSwagger = (app) => {
  const options = new DocumentBuilder()
    .setTitle('Export Api')
    .setDescription('API for Export Job Management and Processing')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
};

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const globalPrefix = 'api';
  const port = process.env.PORT || 3400;

  // Ensure exports directory exists
  const exportsDir = join(process.cwd(), 'exports');
  if (!fs.existsSync(exportsDir)) {
    fs.mkdirSync(exportsDir, { recursive: true });
  }

  // Serve export files as static assets
  app.useStaticAssets(exportsDir, {
    prefix: '/exports/',
  });

  app.enableCors();
  app.setGlobalPrefix(globalPrefix);

  configureSwagger(app);

  await app.listen(port);
  Logger.log(
    `Export API running on: http://localhost:${port}/${globalPrefix}`,
  );
  Logger.log(
    `Export files served at: http://localhost:${port}/exports/`,
  );
}

bootstrap();
