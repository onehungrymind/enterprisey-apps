import { DataSource, DataSourceOptions, getMetadataArgsStorage } from 'typeorm';
import {
  Seeder,
  SeederOptions,
  SeederFactoryManager,
  runSeeders,
} from 'typeorm-extension';

import { Feature } from './entities/feature.entity';

/**
 * Real features for the data pipeline platform.
 * These map to the Module Federation remotes.
 */
const FEATURES: Partial<Feature>[] = [
  {
    slug: 'ingress',
    title: 'Ingress',
    description: 'Connect and manage data sources. Monitor connection health and discover schemas.',
    remote_uri: 'http://localhost:4202',
    api_uri: 'http://localhost:3100/api',
    healthy: true,
  },
  {
    slug: 'transformation',
    title: 'Transformation',
    description: 'Build data pipelines with configurable transform steps. Preview output schemas in real-time.',
    remote_uri: 'http://localhost:4203',
    api_uri: 'http://localhost:3200/api',
    healthy: true,
  },
  {
    slug: 'reporting',
    title: 'Reporting',
    description: 'Create dashboards with customizable widgets. Visualize your data with charts and tables.',
    remote_uri: 'http://localhost:4204',
    api_uri: 'http://localhost:3300/api',
    healthy: true,
  },
  {
    slug: 'export',
    title: 'Export',
    description: 'Export data in multiple formats. Track job progress and manage scheduled exports.',
    remote_uri: 'http://localhost:4205',
    api_uri: 'http://localhost:3400/api',
    healthy: true,
  },
  {
    slug: 'users',
    title: 'Users',
    description: 'Manage user accounts, roles, and permissions.',
    remote_uri: 'http://localhost:4201',
    api_uri: 'http://localhost:3500/api',
    healthy: true,
  },
];

export class MainSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<any> {
    const featuresRepository = dataSource.getRepository(Feature);

    for (const featureData of FEATURES) {
      const feature = featuresRepository.create(featureData);
      await featuresRepository.save(feature);
      console.log(`Seeded feature: ${feature.title}`);
    }
  }
}

const options: DataSourceOptions & SeederOptions = {
  type: 'better-sqlite3',
  database: './databases/features.sqlite',
  synchronize: true,
  logging: true,
  entities: getMetadataArgsStorage().tables.map((tbl) => tbl.target),
  seeds: [MainSeeder],
};

const dataSource = new DataSource(options);

dataSource.initialize().then(async () => {
  await dataSource.synchronize(true);
  await runSeeders(dataSource);
  process.exit();
});
