import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { noteProviders } from './note.providers';
import { DatabaseModule } from '../database/database.module';
import { NotesResolver } from './notes.resolver';
import { UserResolver } from '../user/user.resolver';

@Module({
  imports: [DatabaseModule],
  controllers: [NotesController],
  providers: [...noteProviders, NotesService, NotesResolver, UserResolver],
  exports: [NotesService],
})
export class NotesModule {}
