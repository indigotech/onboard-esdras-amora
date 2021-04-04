import { Arg, Authorized, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { PaginatedUsersUseCase } from '@domain/paginated-users.use-case';
import { CreateUserUseCase } from '@domain/create-user.use-case';
import { LoginUserUseCase } from '@domain/login-user.use-case';
import { GetUserUseCase } from '@domain/get-user.use-case';
import { PageInput } from '@api/common/page.input';
import { PaginatedUsers } from './paginated-users.response';
import { UserResponse } from './create-user.response';
import { CreateUserInput } from './create-user.input';
import { LoginInput } from './login.input';
import { LoginResponse } from './login.response';

@Service()
@Resolver()
export class UserResolver {
  constructor(
    private createUseCase: CreateUserUseCase,
    private loginUseCase: LoginUserUseCase,
    private getUseCase: GetUserUseCase,
    private getPaginatedUsersUseCase: PaginatedUsersUseCase,
  ) {}

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
