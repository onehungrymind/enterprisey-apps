import { ReportQuery } from '../database/entities/report-query.entity';
import { DataSource } from 'typeorm';

export const queryProviders = [
  {
    provide: 'REPORT_QUERY_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(ReportQuery),
    inject: ['DATABASE_CONNECTION'],
  },
];
