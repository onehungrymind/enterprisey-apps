import { ResolveField, Resolver, ResolveReference } from '@nestjs/graphql';
import { NotesService } from '../notes/notes.service';

@Resolver('User')
export class UserResolver {
  constructor(private readonly notesService: NotesService) {}
  @ResolveReference()
  async resolveReference(reference: { __typename: string; id: string }) {
    return { id: reference.id, __typename: 'User' };
  }

  @ResolveField('notes')
  async notesField({ id }: { id: string }) {
    return this.notesService.findByUserId(id);
  }
}
