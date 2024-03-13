import { Module, forwardRef } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
