import { Faker, faker } from '@faker-js/faker';
import { DataSource, DataSourceOptions, getMetadataArgsStorage } from 'typeorm';
import {
  Seeder,
  SeederOptions,
  SeederFactoryManager,
  runSeeders,
  setSeederFactory,
} from 'typeorm-extension';

import { Flashcard } from './entities/flashcard.entity';

export const FlashcardsFactory = setSeederFactory(Flashcard, (faker: Faker) => {
  const flashcard = new Flashcard();
  flashcard.title = faker.company.buzzPhrase();
  flashcard.description = faker.lorem.sentence();
  flashcard.question = faker.lorem.sentence();
  flashcard.answer = faker.lorem.sentence();
  flashcard.user_id = faker.string.uuid();

  return flashcard;
});

export class MainSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<any> {
    const flashcardsFactory = factoryManager.get(Flashcard);
    const flashcardsRepository = dataSource.getRepository(Flashcard);
    const flashcards = await flashcardsFactory.saveMany(9);
  }
}

const options: DataSourceOptions & SeederOptions = {
  type: 'sqlite',
  database: './databases/flashcards.sqlite',
  synchronize: true,
  logging: true,
  entities: getMetadataArgsStorage().tables.map((tbl) => tbl.target),
  factories: [FlashcardsFactory],
  seeds: [MainSeeder],
};

const dataSource = new DataSource(options);

dataSource.initialize().then(async () => {
  await dataSource.synchronize(true);
  await runSeeders(dataSource);
  process.exit();
});
