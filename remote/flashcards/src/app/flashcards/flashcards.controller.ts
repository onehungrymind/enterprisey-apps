import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Flashcard } from '../database/entities/flashcard.entity';
import { FlashcardsService } from './flashcards.service';

@Controller('flashcards')
export class FlashcardsController {
  constructor(private readonly flashcardsService: FlashcardsService) { }

  @Post()
  create(@Body() flashcard: Flashcard): Promise<Flashcard> {
    return this.flashcardsService.create(flashcard);
  }

  @Get()
  findAll(): Promise<Flashcard[]> {
    return this.flashcardsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Flashcard> {
    return this.flashcardsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() flashcard: Flashcard) {
    return this.flashcardsService.update(flashcard);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.flashcardsService.remove(id);
  }
}
