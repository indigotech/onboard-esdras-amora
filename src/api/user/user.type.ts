import { gql } from 'apollo-server-express';
import { Field, ObjectType } from 'type-graphql';
import { AddressResponse, AddressResponseFragment } from './address.type';

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

export const UserResponseFragment = gql`
  ${AddressResponseFragment}
  fragment UserResponse on UserResponse {
    id
    name
    email
    addresses {
      ...AddressResponse
    }
  }
`;
