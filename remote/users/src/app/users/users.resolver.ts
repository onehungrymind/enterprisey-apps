import { Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';

@Resolver()
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
  ) {
  }

  @Query()
  async users() {
    return this.usersService.findAll();
  }
}
