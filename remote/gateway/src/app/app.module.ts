import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      gateway: {
        serviceList: [
          { name: 'users', url: 'http://users:3500/graphql' },
          { name: 'notes', url: 'http://notes:3500/graphql' },
        ],
      },
      server: {
        introspection: true,
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
