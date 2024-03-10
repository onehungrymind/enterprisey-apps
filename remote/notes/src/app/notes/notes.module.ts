import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { noteProviders } from './note.providers';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [NotesController],
  providers: [...noteProviders, NotesService],
  exports: [NotesService],
})
export class NotesModule {}
