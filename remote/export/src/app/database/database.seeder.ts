import { Faker } from '@faker-js/faker';
import { DataSource, DataSourceOptions, getMetadataArgsStorage } from 'typeorm';
import {
  Seeder,
  SeederOptions,
  SeederFactoryManager,
  runSeeders,
  setSeederFactory,
} from 'typeorm-extension';

import { ExportJobEntity } from './entities/export-job.entity';

const formats = ['csv', 'json', 'xlsx', 'pdf'];

export const ExportJobFactory = setSeederFactory(ExportJobEntity, (faker: Faker) => {
  const job = new ExportJobEntity();
  const format = faker.helpers.arrayElement(formats);
  const name = `${faker.company.name()} ${faker.word.noun()} export`;
  job.name = name;
  job.queryId = faker.string.uuid();
  job.format = format;
  job.status = 'completed';
  job.progress = 100;
  job.scheduleCron = faker.helpers.arrayElement([null, '0 0 * * *', '0 */6 * * *', '0 0 * * 1']);
  job.outputUrl = `/exports/${name.replace(/\s+/g, '-').toLowerCase()}.${format}`;
  job.createdBy = faker.string.uuid();
  job.startedAt = faker.date.recent({ days: 7 }).toISOString();
  job.completedAt = faker.date.recent({ days: 1 }).toISOString();
  job.fileSize = faker.number.int({ min: 1024, max: 10485760 });
  job.recordCount = faker.number.int({ min: 100, max: 500000 });
  job.error = null;

  return job;
});

export class MainSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<any> {
    const jobsFactory = factoryManager.get(ExportJobEntity);
    await jobsFactory.saveMany(5);
  }
}

const options: DataSourceOptions & SeederOptions = {
  type: 'sqlite',
  database: './databases/export.sqlite',
  synchronize: true,
  logging: true,
  entities: getMetadataArgsStorage().tables.map((tbl) => tbl.target),
  factories: [ExportJobFactory],
  seeds: [MainSeeder],
};

const ds = new DataSource(options);

ds.initialize().then(async () => {
  await ds.synchronize(true);
  await runSeeders(ds);
  process.exit();
});
