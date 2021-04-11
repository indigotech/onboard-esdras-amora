import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class AddressResponse {
  @Field()
  id!: string;

  @Field()
  cep!: string;

  @Field()
  street!: string;

  @Field()
  streetNumber!: string;

  @Field()
  complement?: string;

  @Field()
  neighborhood!: string;

  @Field()
  city!: string;

  @Field()
  state!: string;
}
