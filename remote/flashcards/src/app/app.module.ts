import { Module } from '@nestjs/common';
import { FlashcardsModule } from './flashcards/flashcards.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [FlashcardsModule, DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
