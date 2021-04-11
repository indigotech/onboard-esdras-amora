import Container from 'typedi';
import { v4 as uuid } from 'uuid';
import { expect } from 'chai';
import { gql } from 'apollo-server-express';
import { getRepository, Repository } from 'typeorm';
import { UserEntity } from '@data/db/entities';
import { RequestMaker } from '@test/request-maker';
import { StatusCode } from '@core/error/error.type';
import { LocalizationService } from '@core/localization';
import { UserResponse } from './user.type';
import { UserResponseFragment } from './user.type';
import { AddressSeed, UserSeed } from '@data/db/seeds';

describe('GraphQL - UserResolver - Get', () => {
  let repository: Repository<UserEntity>;
  let locale: LocalizationService;
  let requestMaker: RequestMaker;
  let userSeed: UserSeed;
  let addressSeed: AddressSeed;

  const getUserQuery = gql`
    ${UserResponseFragment}
    query user($id: String!) {
      user(id: $id) {
        ...UserResponse
      }
    }
  `;

  before(() => {
    requestMaker = new RequestMaker();
    userSeed = Container.get(UserSeed);
    addressSeed = Container.get(AddressSeed);
    repository = getRepository(UserEntity);
    locale = Container.get(LocalizationService);
    requestMaker.refreshAuth();
  });

  afterEach(async () => {
    await repository.delete({});
  });

  it('should return the specified user', async () => {
    const id = uuid();
    const [userDb] = await userSeed.exec(1, { id, addresses: [] });

    const response = await requestMaker.postGraphQL<{ user: UserResponse }>(getUserQuery, {
      id,
    });
    const data = response.body.data?.user;

    expect(data?.id).to.be.eq(id);
    expect(data?.name).to.be.eq(userDb.name);
    expect(data?.email).to.be.eq(userDb.email);

    expect(data?.addresses).to.be.deep.eq(null);
  });

  it('should return the specified user and their address', async () => {
    const id = uuid();
    const [userDb] = await userSeed.exec(1, { id, addresses: await addressSeed.exec() });

    const response = await requestMaker.postGraphQL<{ user: UserResponse }>(getUserQuery, {
      id,
    });
    const data = response.body.data?.user;

    expect(data?.id).to.be.eq(id);
    expect(data?.name).to.be.eq(userDb.name);
    expect(data?.email).to.be.eq(userDb.email);

    expect(data?.addresses).to.be.deep.eq(
      userDb.addresses?.map(({ id, cep, street }) => ({
        id,
        cep,
        street,
      })),
    );
  });

  it('should give error if user was not found', async () => {
    await userSeed.exec(1);

    const response = await requestMaker.postGraphQL<{ user: UserResponse }>(getUserQuery, {
      id: uuid(),
    });
    expect(response.body.data).to.be.null;
    expect(response.body.errors?.[0].code).to.be.eq(StatusCode.NotFound);
    expect(response.body.errors?.[0].message).to.be.eq(locale.__('get-user.error.not-found'));
  });
});
