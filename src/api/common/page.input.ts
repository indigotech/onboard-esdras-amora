import { Min } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';
import { PageInputModel } from '@core/pagination';

@InputType()
export class PageInput implements PageInputModel {
  @Field(() => Int, { description: 'Number of elements to skip', nullable: true })
  @Min(0)
  offset?: number;

  @Field(() => Int, { description: 'Page to retrieve', nullable: true })
  @Min(0)
  page?: number;

  @Field(() => Int, { description: 'Max items per result', defaultValue: 10 })
  @Min(0)
  limit!: number;
}
