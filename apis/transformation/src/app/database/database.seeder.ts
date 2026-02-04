import { Faker } from '@faker-js/faker';
import { DataSource, DataSourceOptions, getMetadataArgsStorage } from 'typeorm';
import {
  Seeder,
  SeederOptions,
  SeederFactoryManager,
  runSeeders,
  setSeederFactory,
} from 'typeorm-extension';

import { PipelineEntity } from './entities/pipeline.entity';
import { TransformStepEntity } from './entities/transform-step.entity';
import { PipelineRunEntity } from './entities/pipeline-run.entity';

const pipelineStatuses = ['draft', 'active', 'paused', 'error'];
const stepTypes = ['filter', 'map', 'aggregate', 'join', 'sort', 'deduplicate'];

export const PipelineFactory = setSeederFactory(PipelineEntity, (faker: Faker) => {
  const pipeline = new PipelineEntity();
  pipeline.name = `${faker.company.name()} Pipeline`;
  pipeline.description = faker.lorem.sentence();
  pipeline.sourceId = faker.string.uuid();
  pipeline.status = faker.helpers.arrayElement(pipelineStatuses);
  pipeline.lastRunAt = pipeline.status === 'active' ? faker.date.recent().toISOString() : null;
  pipeline.createdBy = faker.string.uuid();
  return pipeline;
});

export class MainSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<any> {
    const pipelineFactory = factoryManager.get(PipelineEntity);
    const pipelines = await pipelineFactory.saveMany(3);

    const stepRepo = dataSource.getRepository(TransformStepEntity);
    const runRepo = dataSource.getRepository(PipelineRunEntity);

    for (const pipeline of pipelines) {
      // Create 2-3 steps per pipeline
      const stepCount = Math.random() > 0.5 ? 3 : 2;
      const shuffledTypes = [...stepTypes].sort(() => Math.random() - 0.5);

      for (let i = 0; i < stepCount; i++) {
        const step = new TransformStepEntity();
        step.pipelineId = pipeline.id;
        step.order = i;
        step.type = shuffledTypes[i];
        step.config = getStepConfig(step.type);
        step.inputSchema = [
          { name: 'id', type: 'number', nullable: false, sampleValues: ['1', '2', '3'] },
          { name: 'name', type: 'string', nullable: false, sampleValues: ['Alice', 'Bob'] },
          { name: 'email', type: 'string', nullable: true, sampleValues: ['alice@example.com'] },
          { name: 'amount', type: 'number', nullable: false, sampleValues: ['100', '250'] },
        ];
        step.outputSchema = computeOutputSchema(step.type, step.inputSchema);
        await stepRepo.save(step);
      }

      // Create 1 run per pipeline
      const run = new PipelineRunEntity();
      run.pipelineId = pipeline.id;
      run.status = 'completed';
      run.startedAt = new Date(Date.now() - 60000).toISOString();
      run.completedAt = new Date().toISOString();
      run.recordsProcessed = Math.floor(Math.random() * 10000) + 100;
      run.errors = [];
      await runRepo.save(run);
    }
  }
}

function getStepConfig(type: string): Record<string, any> {
  switch (type) {
    case 'filter':
      return { field: 'amount', operator: 'gt', value: 100 };
    case 'map':
      return { mappings: [{ from: 'name', to: 'fullName' }, { from: 'email', to: 'contactEmail' }] };
    case 'aggregate':
      return { groupBy: ['name'], metrics: [{ field: 'amount', function: 'sum', alias: 'totalAmount' }] };
    case 'join':
      return { targetSourceId: 'some-uuid', joinField: 'id', targetField: 'userId' };
    case 'sort':
      return { field: 'amount', direction: 'desc' };
    case 'deduplicate':
      return { fields: ['email'] };
    default:
      return {};
  }
}

function computeOutputSchema(
  type: string,
  inputSchema: { name: string; type: string; nullable: boolean; sampleValues: string[] }[],
): { name: string; type: string; nullable: boolean; sampleValues: string[] }[] {
  switch (type) {
    case 'filter':
      return [...inputSchema];
    case 'map':
      return inputSchema.map((f) =>
        f.name === 'name' ? { ...f, name: 'fullName' } : f.name === 'email' ? { ...f, name: 'contactEmail' } : f
      );
    case 'aggregate':
      return [
        { name: 'name', type: 'string', nullable: false, sampleValues: ['Alice', 'Bob'] },
        { name: 'totalAmount', type: 'number', nullable: false, sampleValues: ['350'] },
      ];
    case 'sort':
    case 'deduplicate':
      return [...inputSchema];
    case 'join':
      return [
        ...inputSchema,
        { name: 'userId', type: 'number', nullable: true, sampleValues: ['1'] },
      ];
    default:
      return [...inputSchema];
  }
}

const options: DataSourceOptions & SeederOptions = {
  type: 'better-sqlite3',
  database: './databases/transformation.sqlite',
  synchronize: true,
  logging: true,
  entities: getMetadataArgsStorage().tables.map((tbl) => tbl.target),
  factories: [PipelineFactory],
  seeds: [MainSeeder],
};

const ds = new DataSource(options);

ds.initialize().then(async () => {
  await ds.synchronize(true);
  await runSeeders(ds);
  process.exit();
});
