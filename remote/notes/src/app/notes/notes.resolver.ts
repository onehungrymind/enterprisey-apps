import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NotesService } from './notes.service';
import { NoteInput } from '@proto/graphql';
import { v4 } from 'uuid';

@Resolver('Note')
export class NotesResolver {
  constructor(private readonly notesService: NotesService) {}

  @Query()
  async note(@Args('id') id: string) {
    return this.notesService.findOne(id);
  }

  @Mutation()
  async createNote(
    @Args('userId') userId: string,
    @Args('content') content: NoteInput
  ) {
    const note = {
      id: v4(),
      user_id: userId,
      title: content.title,
      content: content.content,
      type: content.type,
    };
    return this.notesService.create(note);
  }
}
