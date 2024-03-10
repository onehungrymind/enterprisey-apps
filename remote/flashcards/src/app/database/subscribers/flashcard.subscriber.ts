import { Logger } from '@nestjs/common';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  UpdateEvent,
} from 'typeorm';
import { Flashcard } from '../entities/flashcard.entity';

@EventSubscriber()
export class FlashcardSubscriber
  implements EntitySubscriberInterface<Flashcard>
{
  listenTo(): any {
    return Flashcard;
  }

  afterUpdate(event: UpdateEvent<Flashcard>): Promise<any> | void {
    Logger.log(`Flashcard Updated: ${event.databaseEntity.id}`);
  }
}
