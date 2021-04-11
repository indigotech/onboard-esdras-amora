import { Field, Int, ObjectType } from 'type-graphql';
import { Paginated } from '@core/pagination';
import { PageInfo } from '@api/common/page-info.type';
import { UserResponse } from './user.type';

@ObjectType()
export class PaginatedUsers implements Paginated<UserResponse> {
  @Field(() => [UserResponse], { description: `Array of users` })
  nodes!: UserResponse[];

  @Field(() => Int, { description: 'Total number of elements' })
  count!: number;

  @Field(() => PageInfo, { description: 'Page information' })
  pageInfo!: PageInfo;
}
