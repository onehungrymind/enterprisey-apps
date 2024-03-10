import { Faker, faker } from '@faker-js/faker';
import { DataSource, DataSourceOptions, getMetadataArgsStorage } from 'typeorm';
import {
  Seeder,
  SeederOptions,
  SeederFactoryManager,
  runSeeders,
  setSeederFactory,
} from 'typeorm-extension';

import { Challenge } from './entities/challenge.entity';

export const ChallengesFactory = setSeederFactory(Challenge, (faker: Faker) => {
  const challenge = new Challenge();
  challenge.title = faker.person.jobTitle();
  challenge.description = faker.lorem.sentence();
  challenge.completed = faker.datatype.boolean();
  challenge.repo_url = faker.internet.url();
  challenge.comment = faker.lorem.sentences(3);
  challenge.user_id = faker.string.uuid();

  return challenge;
});

export class MainSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<any> {
    const challengesFactory = factoryManager.get(Challenge);
    const challengesRepository = dataSource.getRepository(Challenge);
    const challenges = await challengesFactory.saveMany(9);
  }
}

const options: DataSourceOptions & SeederOptions = {
  type: 'sqlite',
  database: './databases/challenges.sqlite',
  synchronize: true,
  logging: true,
  entities: getMetadataArgsStorage().tables.map((tbl) => tbl.target),
  factories: [ChallengesFactory],
  seeds: [MainSeeder],
};

const dataSource = new DataSource(options);

dataSource.initialize().then(async () => {
  await dataSource.synchronize(true);
  await runSeeders(dataSource);
  process.exit();
});
