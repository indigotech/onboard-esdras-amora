import Container from 'typedi';
import { getRepository, Repository } from 'typeorm';
import { expect } from 'chai';
import { gql } from 'apollo-server-express';
import { PageInfoResponseFragment } from '@api/common/page-info.type';
import { RequestMaker } from '@test/request-maker';
import { PageInputModel, Paginated } from '@core/pagination';
import { StatusCode } from '@core/error';
import { UserEntity } from '@data/db/entities';
import { UserSeed } from '@data/db/seeds';
import { UserResponse, UserResponseFragment } from './user.type';
import { AddressResponse } from './address.type';
import { countBy } from 'lodash';

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
  const total = 25;
  const limit = 6;

  before(async () => {
    requestMaker = new RequestMaker();
    requestMaker.refreshAuth();
    repository = getRepository(UserEntity);
    userSeed = Container.get(UserSeed);
    await userSeed.exec(total);
  });

  after(async () => {
    await repository.delete({});
  });

  const mapAddresses = (addresses: AddressResponse[] | undefined) => {
    const objectValues: string[] = [];
    addresses?.forEach(({ id, cep, street }) => objectValues.push(...Object.values({ id, cep, street })));
    return countBy(objectValues);
  };

  const assertPagination = async (page: number, total: number, limit: number, offset = limit * page) => {
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

    const [dbUsers, count] = await repository.findAndCount({
      take: limit,
      skip: offset,
      order: { name: 'ASC' },
      relations: ['addresses'],
    });
    expect(dbUsers.length).to.be.eq(data?.users.nodes.length);
    expect(count).to.be.eq(data?.users.count);
    dbUsers.map(({ id, email, name, addresses }, index) => {
      expect({ id, email, name }).to.be.deep.eq({
        id: data?.users.nodes[index].id,
        email: data?.users.nodes[index].email,
        name: data?.users.nodes[index].name,
      });
      expect(mapAddresses(addresses)).to.be.deep.eq(mapAddresses(data?.users.nodes[index].addresses));
    });
  };

  describe('should return a paginated list of users ', () => {
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

  it('Should return an error if any arg is less than 0', async () => {
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
