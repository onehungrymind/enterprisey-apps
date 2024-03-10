import { Faker, faker } from '@faker-js/faker';
import { DataSource, DataSourceOptions, getMetadataArgsStorage } from 'typeorm';
import {
  Seeder,
  SeederOptions,
  SeederFactoryManager,
  runSeeders,
  setSeederFactory,
} from 'typeorm-extension';

import { Feature } from './entities/feature.entity';

export const FeaturesFactory = setSeederFactory(Feature, (faker: Faker) => {
  const feature = new Feature();
  feature.title = faker.person.jobTitle();
  feature.description = faker.lorem.sentence();
  feature.remote_uri = faker.internet.url();
  feature.api_uri = faker.lorem.sentences(3);
  feature.healthy = faker.datatype.boolean();

  return feature;
});

export class MainSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<any> {
    const featuresFactory = factoryManager.get(Feature);
    const featuresRepository = dataSource.getRepository(Feature);
    const features = await featuresFactory.saveMany(9);
  }
}

const options: DataSourceOptions & SeederOptions = {
  type: 'sqlite',
  database: './databases/features.sqlite',
  synchronize: true,
  logging: true,
  entities: getMetadataArgsStorage().tables.map((tbl) => tbl.target),
  factories: [FeaturesFactory],
  seeds: [MainSeeder],
};

const dataSource = new DataSource(options);

dataSource.initialize().then(async () => {
  await dataSource.synchronize(true);
  await runSeeders(dataSource);
  process.exit();
});
