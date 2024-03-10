import { Module } from '@nestjs/common';
import { FlashcardsService } from './flashcards.service';
import { FlashcardsController } from './flashcards.controller';
import { flashcardProviders } from './flashcard.providers';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [FlashcardsController],
  providers: [...flashcardProviders, FlashcardsService],
  exports: [FlashcardsService],
})
export class FlashcardsModule {}
