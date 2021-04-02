import { Arg, Mutation, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { CreateUserUseCase } from '@domain/create-user.use-case';
import { LoginUserUseCase } from '@domain/login-user.use-case';
import { CreateUserResponse } from './create-user.response';
import { CreateUserInput } from './create-user.input';
import { LoginInput } from './login.input';
import { LoginResponse } from './login.response';

@Service()
@Resolver()
export class UserResolver {
  constructor(private createUseCase: CreateUserUseCase, private loginUseCase: LoginUserUseCase) {}

  @Mutation(() => CreateUserResponse, { description: 'Create user' })
  createUser(@Arg('data') data: CreateUserInput): Promise<CreateUserResponse> {
    return this.createUseCase.exec(data);
  }

  @Mutation(() => LoginResponse, { description: 'Login user' })
  login(@Arg('data') data: LoginInput): Promise<LoginResponse> {
    return this.loginUseCase.exec(data);
  }
}
