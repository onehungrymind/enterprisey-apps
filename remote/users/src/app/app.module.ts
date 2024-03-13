import { Module, forwardRef } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => AuthModule),
    DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
