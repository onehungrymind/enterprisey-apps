import { Logger } from '@nestjs/common';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  UpdateEvent,
} from 'typeorm';
import { Note } from '../entities/note.entity';

@EventSubscriber()
export class NoteSubscriber implements EntitySubscriberInterface<Note> {
  listenTo(): any {
    return Note;
  }

  afterUpdate(event: UpdateEvent<Note>): Promise<any> | void {
    Logger.log(`Note Updated: ${event.databaseEntity.id}`);
  }
}
