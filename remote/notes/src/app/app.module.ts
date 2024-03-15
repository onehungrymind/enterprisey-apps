import { Module } from '@nestjs/common';
import { NotesModule } from './notes/notes.module';
import { DatabaseModule } from './database/database.module';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      include: [NotesModule],
      driver: ApolloFederationDriver,
      typePaths: ['./**/notes/**/*.graphql'],
      playground: true,
      introspection: true,
    }),
    NotesModule,
    DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
