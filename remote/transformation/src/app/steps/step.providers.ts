import { TransformStepEntity } from '../database/entities/transform-step.entity';
import { DataSource } from 'typeorm';

export const stepProviders = [
  {
    provide: 'STEP_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(TransformStepEntity),
    inject: ['DATABASE_CONNECTION'],
  },
];
