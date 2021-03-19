import { Arg, Mutation, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { CreateUserUseCase } from '@domain/create-user.use-case';
import { UserInput } from '@domain/user.input';
import { CreateUserResponse } from '@domain/create-user.response';

@Service()
@Resolver()
export class UserResolver {
  constructor(private createUseCase: CreateUserUseCase) {}

  @Mutation(() => CreateUserResponse, { description: 'Create user' })
  createUser(@Arg('data') data: UserInput): Promise<CreateUserResponse> {
    return this.createUseCase.exec(data);
  }
}
