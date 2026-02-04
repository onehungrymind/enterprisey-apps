import { PipelineEntity } from '../database/entities/pipeline.entity';
import { PipelineRunEntity } from '../database/entities/pipeline-run.entity';
import { DataSource } from 'typeorm';

export const pipelineProviders = [
  {
    provide: 'PIPELINE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(PipelineEntity),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'PIPELINE_RUN_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(PipelineRunEntity),
    inject: ['DATABASE_CONNECTION'],
  },
];
