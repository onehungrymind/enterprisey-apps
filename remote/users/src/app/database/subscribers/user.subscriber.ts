import { Logger } from '@nestjs/common';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  UpdateEvent,
} from 'typeorm';
import { User } from '../entities/user.entity';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  listenTo(): any {
    return User;
  }

  afterUpdate(event: UpdateEvent<User>): Promise<any> | void {
    Logger.log(`User Updated: ${event.databaseEntity.id}`);
  }
}
