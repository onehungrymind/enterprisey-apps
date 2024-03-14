import { Module, forwardRef } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { GraphQLModule } from '@nestjs/graphql';
import {ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      include: [UsersModule, AuthModule],
      driver: ApolloFederationDriver,
      typePaths: ['./**/**/*.graphql'],
      playground: true,
      introspection: true,
    }),
    forwardRef(() => UsersModule),
    forwardRef(() => AuthModule),
    DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
