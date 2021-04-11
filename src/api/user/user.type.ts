import { Field, ObjectType } from 'type-graphql';
import { AddressResponse } from './address.type';

@ObjectType()
export class UserResponse {
  @Field({ description: 'User id' })
  id!: string;

  @Field({ description: 'User name' })
  name!: string;

  @Field({ description: 'User email' })
  email!: string;

  @Field(() => [AddressResponse], { description: 'User addresses', nullable: true })
  addresses?: AddressResponse[];
}
