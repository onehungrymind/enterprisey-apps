import { Module, forwardRef } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { CompaniesModule } from './companies/companies.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => CompaniesModule),
    forwardRef(() => AuthModule),
    DatabaseModule,
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
