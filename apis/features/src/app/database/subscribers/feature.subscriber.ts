import { Logger } from '@nestjs/common';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  UpdateEvent,
} from 'typeorm';
import { Feature } from '../entities/feature.entity';

@EventSubscriber()
export class FeatureSubscriber implements EntitySubscriberInterface<Feature> {
  listenTo(): any {
    return Feature;
  }

  afterUpdate(event: UpdateEvent<Feature>): Promise<any> | void {
    Logger.log(`Feature Updated: ${event.databaseEntity.id}`);
  }
}
