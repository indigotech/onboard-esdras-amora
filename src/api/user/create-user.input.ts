import { Field, InputType } from 'type-graphql';
import { UserInputModel } from '@domain/model/user.model';

@InputType()
export class CreateUserInput implements UserInputModel {
  @Field({ description: 'User name' })
  name!: string;

  @Field({ description: 'User email' })
  email!: string;

  @Field({ description: 'User password' })
  password!: string;
}
