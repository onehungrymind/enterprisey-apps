import { Logger } from '@nestjs/common';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  UpdateEvent,
} from 'typeorm';
import { Challenge } from '../entities/challenge.entity';

@EventSubscriber()
export class ChallengeSubscriber
  implements EntitySubscriberInterface<Challenge>
{
  listenTo(): any {
    return Challenge;
  }

  afterUpdate(event: UpdateEvent<Challenge>): Promise<any> | void {
    Logger.log(`Challenge Updated: ${event.databaseEntity.id}`);
  }
}
