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
import { Note } from '../database/entities/note.entity';
import { NotesService } from './notes.service';
import { Roles, JwtAuthGuard } from '@proto/guards/remote-auth';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  create(@Body() note: Note): Promise<Note> {
    return this.notesService.create(note);
  }

  @Get()
  @Roles(['tester'])
  @UseGuards(JwtAuthGuard)
  findAll(): Promise<Note[]> {
    return this.notesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Note> {
    return this.notesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() note: Note) {
    return this.notesService.update(note);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notesService.remove(id);
  }
}
