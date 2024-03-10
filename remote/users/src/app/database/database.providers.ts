import { InjectionToken } from '@nestjs/common';
import { getMetadataArgsStorage, DataSource, DataSourceOptions } from 'typeorm';

export const DATABASE_CONNECTION: InjectionToken = 'DATABASE_CONNECTION';

export const databaseProviders = [
  {
    provide: DATABASE_CONNECTION,
    useFactory: () =>
      new DataSource({
        type: 'sqlite',
        database: './databases/users.sqlite',
        synchronize: true,
        logging: false,
        entities: getMetadataArgsStorage().tables.map((tbl) => tbl.target),
        migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
        subscribers: [__dirname + '/subscribers/**/*{.ts,.js}'],
        cli: {
          entitiesDir: '/entities',
          migrationsDir: '/migrations',
          subscribersDir: '/subscribers',
        },
      } as DataSourceOptions).initialize(),
  },
];
