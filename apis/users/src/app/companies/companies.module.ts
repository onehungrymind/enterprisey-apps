import { Module, forwardRef } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { companyProviders } from './company.providers';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DatabaseModule, forwardRef(() => AuthModule)],
  controllers: [CompaniesController],
  providers: [...companyProviders, CompaniesService],
  exports: [CompaniesService],
})
export class CompaniesModule {}
