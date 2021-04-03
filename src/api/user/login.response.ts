import { Field, ObjectType } from 'type-graphql';
import { UserResponse } from './create-user.response';

@ObjectType()
export class LoginResponse {
  @Field(() => UserResponse, { description: 'User default response' })
  user!: UserResponse;

  @Field({ description: 'JWT token' })
  token!: string;
}
