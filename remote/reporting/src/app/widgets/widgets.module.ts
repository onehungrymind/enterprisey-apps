import { Module } from '@nestjs/common';
import { WidgetsService } from './widgets.service';
import { WidgetsController } from './widgets.controller';
import { widgetProviders } from './widget.providers';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [WidgetsController],
  providers: [...widgetProviders, WidgetsService],
  exports: [WidgetsService],
})
export class WidgetsModule {}
