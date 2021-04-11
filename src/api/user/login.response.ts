import { Field, ObjectType } from 'type-graphql';
import { UserResponse } from './user.type';

@ObjectType()
export class LoginResponse {
  @Field(() => UserResponse, { description: 'User default response' })
  user!: UserResponse;

  @Field({ description: 'JWT token' })
  token!: string;
}
