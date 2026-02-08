import { DataSource } from 'typeorm';
import { Company } from '../database/entities/company.entity';

export const companyProviders = [
  {
    provide: 'COMPANY_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Company),
    inject: ['DATABASE_CONNECTION'],
  },
];
