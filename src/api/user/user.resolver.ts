import { Arg, Authorized, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { PaginatedUsersUseCase } from '@domain/paginated-users.use-case';
import { CreateUserUseCase } from '@domain/create-user.use-case';
import { LoginUserUseCase } from '@domain/login-user.use-case';
import { GetUserUseCase } from '@domain/get-user.use-case';
import { PaginatedUsers } from './paginated-users.response';
import { CreateUserInput } from './create-user.input';
import { ServerContext } from '@api/server.context';
import { PageInput } from '@api/common/page.input';
import { LoginResponse } from './login.response';
import { UserResponse } from './user.type';
import { LoginInput } from './login.input';
import { Service } from 'typedi';

@Service()
@Resolver(UserResponse)
export class UserResolver {
  constructor(
    private createUseCase: CreateUserUseCase,
    private loginUseCase: LoginUserUseCase,
    private getUseCase: GetUserUseCase,
    private getPaginatedUsersUseCase: PaginatedUsersUseCase,
  ) {}

  @FieldResolver(() => String)
  @Authorized()
  addresses(@Root() user: UserResponse, @Ctx() { addressLoader }: ServerContext) {
    return addressLoader.load(user.id);
  }

  @Query(() => UserResponse, { description: 'Get user by id' })
  @Authorized()
  user(@Arg('id', { description: 'User id' }) id: string): Promise<UserResponse> {
    return this.getUseCase.exec(id);
  }

  @Query(() => PaginatedUsers, { description: 'Get paginated users' })
  @Authorized()
  users(@Arg('data') data: PageInput): Promise<PaginatedUsers> {
    return this.getPaginatedUsersUseCase.exec(data);
  }

  @Mutation(() => UserResponse, { description: 'Create user' })
  createUser(@Arg('data') data: CreateUserInput): Promise<UserResponse> {
    return this.createUseCase.exec(data);
  }

  @Mutation(() => LoginResponse, { description: 'Login user' })
  login(@Arg('data') data: LoginInput): Promise<LoginResponse> {
    return this.loginUseCase.exec(data);
  }
}
