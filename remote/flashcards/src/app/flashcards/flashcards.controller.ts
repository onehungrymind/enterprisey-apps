import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Flashcard } from '../database/entities/flashcard.entity';
import { FlashcardsService } from './flashcards.service';
import { JwtAuthGuard, Roles } from '@proto/guards/remote-auth';

@Controller('flashcards')
export class FlashcardsController {
  constructor(private readonly flashcardsService: FlashcardsService) {}

  @Post()
  create(@Body() flashcard: Flashcard): Promise<Flashcard> {
    return this.flashcardsService.create(flashcard);
  }

  @Get()
  @Roles(['tester'])
  @UseGuards(JwtAuthGuard)
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
