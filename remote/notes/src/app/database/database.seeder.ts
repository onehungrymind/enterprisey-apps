import { Faker, faker } from '@faker-js/faker';
import { DataSource, DataSourceOptions, getMetadataArgsStorage } from 'typeorm';
import {
  Seeder,
  SeederOptions,
  SeederFactoryManager,
  runSeeders,
  setSeederFactory,
} from 'typeorm-extension';

import { Note } from './entities/note.entity';

export const NotesFactory = setSeederFactory(Note, (faker: Faker) => {
  const note = new Note();
  note.title =  faker.company.buzzPhrase();
  note.content = faker.lorem.sentences(3);
  note.type = 'text';
  note.user_id = faker.string.uuid();

  return note;
});

export class MainSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<any> {
    const notesFactory = factoryManager.get(Note);
    const notesRepository = dataSource.getRepository(Note);
    const notes = await notesFactory.saveMany(9);
  }
}

const options: DataSourceOptions & SeederOptions = {
  type: 'sqlite',
  database: './databases/notes.sqlite',
  synchronize: true,
  logging: true,
  entities: getMetadataArgsStorage().tables.map((tbl) => tbl.target),
  factories: [NotesFactory],
  seeds: [MainSeeder],
};

const dataSource = new DataSource(options);

dataSource.initialize().then(async () => {
  await dataSource.synchronize(true);
  await runSeeders(dataSource);
  process.exit();
});
