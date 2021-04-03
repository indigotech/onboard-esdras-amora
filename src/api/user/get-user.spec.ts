import * as sinon from 'sinon';
import Container from 'typedi';
import { v4 as uuid } from 'uuid';
import { expect } from 'chai';
import { gql } from 'apollo-server-express';
import { getRepository, Repository } from 'typeorm';
import { UserEntity } from '@data/entities';
import { RequestMaker } from '@test/request-maker';
import { StatusCode } from '@core/error/error.type';
import { LocalizationService } from '@core/localization';
import { UserResponse } from './create-user.response';
import { UserResponseFragment } from './user.fragment';

describe('GraphQL - UserResolver - Get', () => {
  let repository: Repository<UserEntity>;
  let locale: LocalizationService;
  let requestMaker: RequestMaker;

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
    repository = getRepository(UserEntity);
    locale = Container.get(LocalizationService);
  });

  afterEach(async () => {
    sinon.restore();
    await repository.delete({});
  });

  it('should return the specified user', async () => {
    const id = uuid();
    const user = await repository.save({
      email: 'Taq@taqtile.com.br',
      name: 'Taq',
      salt: 'salt',
      password: '123abcd',
      id,
    });

    const response = await requestMaker.postGraphQL<{ user: UserResponse }>(getUserQuery, {
      id,
    });
    const data = response.body.data?.user;
    expect(data?.id).to.be.eq(id);
    expect(data?.name).to.be.eq(user.name);
    expect(data?.email).to.be.eq(user.email);
  });

  it('should give error if user was not found', async () => {
    await repository.save({
      email: 'Taq@taqtile.com.br',
      name: 'Taq',
      salt: 'salt',
      password: '123abcd',
      id: uuid(),
    });

    const response = await requestMaker.postGraphQL<{ user: UserResponse }>(getUserQuery, {
      id: uuid(),
    });
    expect(response.body.data).to.be.null;
    expect(response.body.errors?.[0].code).to.be.eq(StatusCode.NotFound);
    expect(response.body.errors?.[0].message).to.be.eq(locale.__('get-user.error.not-found'));
  });
});
