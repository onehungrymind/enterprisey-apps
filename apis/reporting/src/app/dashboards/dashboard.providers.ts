import { Dashboard } from '../database/entities/dashboard.entity';
import { DataSource } from 'typeorm';

export const dashboardProviders = [
  {
    provide: 'DASHBOARD_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Dashboard),
    inject: ['DATABASE_CONNECTION'],
  },
];
