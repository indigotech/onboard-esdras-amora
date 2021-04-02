import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class LoginResponse {
  @Field({ description: 'User id' })
  id!: string;

  @Field({ description: 'User name' })
  name!: string;

  @Field({ description: 'User email' })
  email!: string;

  @Field({ description: 'JWT token' })
  token!: string;
}
