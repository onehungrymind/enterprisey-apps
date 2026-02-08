import { Module } from '@nestjs/common';
import { WebhooksController } from './webhooks.controller';
import { DatabaseModule } from '../database/database.module';
import { sourceProviders } from '../sources/source.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [WebhooksController],
  providers: [...sourceProviders],
})
export class WebhooksModule {}
