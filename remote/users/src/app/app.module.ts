import { Module, forwardRef } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [forwardRef(() => UsersModule), DatabaseModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
