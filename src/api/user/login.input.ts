import { Field, InputType } from 'type-graphql';
import { LoginInputModel } from '@domain/model/user.model';

@InputType()
export class LoginInput implements LoginInputModel {
  @Field({ description: 'User email' })
  email!: string;

  @Field({ description: 'User password' })
  password!: string;

  @Field({ description: 'Increasse JWT expiration', defaultValue: false })
  rememberMe!: boolean;
}
