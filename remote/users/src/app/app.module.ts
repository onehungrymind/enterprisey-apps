import { Module, forwardRef } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { HealthController } from './health/health.controller';
import { UsersController } from './users/users.controller';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      include: [UsersModule, AuthModule],
      driver: ApolloFederationDriver,
      typePaths: ['./**/users/**/*.graphql'],
      playground: true,
      introspection: true,
    }),
    forwardRef(() => UsersModule),
    forwardRef(() => AuthModule),
    DatabaseModule,
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
