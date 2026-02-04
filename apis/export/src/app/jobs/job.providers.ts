import { ExportJobEntity } from '../database/entities/export-job.entity';
import { DataSource } from 'typeorm';

export const jobProviders = [
  {
    provide: 'JOB_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(ExportJobEntity),
    inject: ['DATABASE_CONNECTION'],
  },
];
