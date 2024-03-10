import { Module } from '@nestjs/common';
import { NotesModule } from './notes/notes.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [NotesModule, DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
