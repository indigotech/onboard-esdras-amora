import Container from 'typedi';
import { getRepository, Repository } from 'typeorm';
import { expect } from 'chai';
import { gql } from 'apollo-server-express';
import { PageInfoResponseFragment } from '@api/common/page-info.type';
import { RequestMaker } from '@test/request-maker';
import { PageInputModel, Paginated } from '@core/pagination';
import { StatusCode } from '@core/error';
import { UserEntity } from '@data/db/entities';
import { UserSeed } from '@data/db/user.seed';
import { UserResponse } from './create-user.response';
import { UserResponseFragment } from './user.fragment';

describe('GraphQL - UserResolver - PaginatedUsers', () => {
  let repository: Repository<UserEntity>;
  let requestMaker: RequestMaker;
  let userSeed: UserSeed;

  const paginatedUsersQuery = gql`
    ${UserResponseFragment}
    ${PageInfoResponseFragment}
    query users($data: PageInput!) {
      users(data: $data) {
        count
        nodes {
          ...UserResponse
        }
        pageInfo {
          ...PageInfoResponse
        }
      }
    }
  `;

  before(() => {
    requestMaker = new RequestMaker();
    requestMaker.refreshAuth();
    repository = getRepository(UserEntity);
    userSeed = Container.get(UserSeed);
  });

  afterEach(async () => {
    await repository.delete({});
  });

  const assertPagination = async (page: number, total: number, limit: number) => {
    const offset = limit * page;
    await userSeed.exec(total);

    const input = {
      data: { limit, page },
    };

    const response = await requestMaker.postGraphQL<{ users: Paginated<UserResponse> }, { data: PageInputModel }>(
      paginatedUsersQuery,
      input,
    );
    const data = response.body.data;
    expect(data?.users.nodes.length).to.be.eq(Math.max(0, Math.min(limit, total - offset)));
    expect(data?.users.pageInfo).to.be.deep.eq({
      page: page,
      offset,
      limit: limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: total > offset + limit,
      hasPreviousPage: offset > 0,
    });

    const [dbUsers, count] = await repository.findAndCount({ take: limit, skip: offset, order: { name: 'ASC' } });
    expect(dbUsers.length).to.be.eq(data?.users.nodes.length);
    expect(count).to.be.eq(data?.users.count);
    dbUsers.map(({ id, email, name }, index) => {
      expect({ id, email, name }).to.be.deep.eq(data?.users.nodes[index]);
    });
  };

  describe('should return a paginated list of users ', () => {
    const total = 50;
    const limit = 12;
    it('on start', async () => {
      await assertPagination(0, total, limit);
    });
    it('on middle', async () => {
      await assertPagination(2, total, limit);
    });
    it('on final', async () => {
      await assertPagination(4, total, limit);
    });
    it('after final', async () => {
      await assertPagination(8, total, limit);
    });
  });

  it('Should return a error if any arg is less than 0', async () => {
    await userSeed.exec();
    const input = {
      data: { limit: -1, page: 0 },
    };

    const response = await requestMaker.postGraphQL<{ users: Paginated<UserResponse> }, { data: PageInputModel }>(
      paginatedUsersQuery,
      input,
    );
    expect(response.body.errors?.[0].code).to.be.eq(StatusCode.BadRequest);
    expect(response.body.errors?.[0].message).to.be.eq('Argument Validation Error');
  });
});
