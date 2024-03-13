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

const capitalizeFirstLetter = (word) =>
  word.charAt(0).toUpperCase() + word.slice(1);

export const FeaturesFactory = setSeederFactory(Feature, (faker: Faker) => {
  const feature = new Feature();
  feature.slug = faker.word.noun();
  feature.title = capitalizeFirstLetter(feature.slug);
  feature.description = faker.lorem.sentence();
  feature.remote_uri = faker.internet.url();
  feature.api_uri = faker.internet.url();
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
    const features = await featuresFactory.saveMany(5);
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
