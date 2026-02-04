import { Faker } from '@faker-js/faker';
import { DataSource, DataSourceOptions, getMetadataArgsStorage } from 'typeorm';
import {
  Seeder,
  SeederOptions,
  SeederFactoryManager,
  runSeeders,
  setSeederFactory,
} from 'typeorm-extension';

import { DataSourceEntity } from './entities/data-source.entity';
import { DataSchemaEntity } from './entities/data-schema.entity';

const sourceTypes = ['database', 'rest_api', 'csv_file', 'webhook'];
const statuses = ['connected', 'disconnected', 'error'];

export const DataSourceFactory = setSeederFactory(DataSourceEntity, (faker: Faker) => {
  const source = new DataSourceEntity();
  const type = faker.helpers.arrayElement(sourceTypes);
  source.name = `${faker.company.name()} ${type === 'database' ? 'DB' : type === 'rest_api' ? 'API' : type === 'csv_file' ? 'CSV' : 'Webhook'}`;
  source.type = type;
  source.status = faker.helpers.arrayElement(statuses);
  source.syncFrequency = faker.helpers.arrayElement(['manual', 'realtime', '*/15 * * * *', '0 * * * *']);
  source.errorLog = source.status === 'error' ? [faker.lorem.sentence()] : [];
  source.createdBy = faker.string.uuid();
  source.lastSyncAt = source.status === 'connected' ? faker.date.recent().toISOString() : null;

  if (type === 'database') {
    source.connectionConfig = { host: faker.internet.domainName(), port: '5432', database: faker.word.noun() };
  } else if (type === 'rest_api') {
    source.connectionConfig = { url: faker.internet.url(), method: 'GET' };
  } else if (type === 'csv_file') {
    source.connectionConfig = { path: `/data/${faker.word.noun()}.csv`, delimiter: ',' };
  } else {
    source.connectionConfig = { endpoint: `/webhooks/${faker.word.noun()}`, secret: faker.string.alphanumeric(32) };
  }

  return source;
});

export class MainSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<any> {
    const sourcesFactory = factoryManager.get(DataSourceEntity);
    const sources = await sourcesFactory.saveMany(6);

    const schemaRepo = dataSource.getRepository(DataSchemaEntity);
    for (const source of sources) {
      const schema = new DataSchemaEntity();
      schema.sourceId = source.id;
      schema.discoveredAt = new Date().toISOString();
      schema.version = 1;
      schema.fields = [
        { name: 'id', type: 'number', nullable: false, sampleValues: ['1', '2', '3'] },
        { name: 'name', type: 'string', nullable: false, sampleValues: ['Alice', 'Bob', 'Charlie'] },
        { name: 'email', type: 'string', nullable: true, sampleValues: ['alice@example.com'] },
        { name: 'created_at', type: 'date', nullable: false, sampleValues: ['2025-01-01T00:00:00Z'] },
        { name: 'active', type: 'boolean', nullable: false, sampleValues: ['true', 'false'] },
      ];
      await schemaRepo.save(schema);
    }
  }
}

const options: DataSourceOptions & SeederOptions = {
  type: 'sqlite',
  database: './databases/ingress.sqlite',
  synchronize: true,
  logging: true,
  entities: getMetadataArgsStorage().tables.map((tbl) => tbl.target),
  factories: [DataSourceFactory],
  seeds: [MainSeeder],
};

const ds = new DataSource(options);

ds.initialize().then(async () => {
  await ds.synchronize(true);
  await runSeeders(ds);
  process.exit();
});
