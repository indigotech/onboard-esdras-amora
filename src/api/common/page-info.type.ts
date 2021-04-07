import { Field, Int, ObjectType } from 'type-graphql';
import { PageInfoModel } from '@core/pagination';
import { gql } from 'apollo-server-core';

@ObjectType()
export class PageInfo implements PageInfoModel {
  @Field(() => Int, { description: 'Current page - 0-index based' })
  page!: number;

  @Field(() => Int, { description: 'Number of skipped elements' })
  offset!: number;

  @Field(() => Int, { description: 'Max items per result' })
  limit!: number;

  @Field(() => Int, { description: 'Total number of pages' })
  totalPages!: number;

  @Field({ description: 'Has next page' })
  hasNextPage!: boolean;

  @Field({ description: 'Has previous page' })
  hasPreviousPage!: boolean;
}

export const PageInfoResponseFragment = gql`
  fragment PageInfoResponse on PageInfo {
    page
    offset
    limit
    totalPages
    hasNextPage
    hasPreviousPage
  }
`;
