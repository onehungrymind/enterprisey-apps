import { GraphQLFederationDefinitionsFactory } from '@nestjs/graphql';
import { join } from 'path';

const definitionsFactory = new GraphQLFederationDefinitionsFactory();
definitionsFactory.generate({
  typePaths: ['./remote/**/*.graphql'],
  path: join(process.cwd(), 'libs/graphql/graphql.ts'),
  outputAs: 'interface',
});
