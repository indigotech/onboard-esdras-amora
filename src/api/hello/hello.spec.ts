import Container from 'typedi';
import { LocalizationService } from '@core/localization';
import { RequestMaker } from '@test/request-maker';
import { gql } from 'apollo-server-express';
import { expect } from 'chai';

describe('GraphQL - HelloResolver - Hello', () => {
  let locale: LocalizationService;
  let requestMaker: RequestMaker;

  before(() => {
    locale = Container.get(LocalizationService);
    requestMaker = new RequestMaker();
  });

  const HelloQuery = gql`
    query hello {
      hello
    }
  `;

  it('should give error if request does not have a valid jwt token', async () => {
    const response = await requestMaker.postGraphQL<{ hello: string }>(HelloQuery);
    const data = response.body.data;
    expect(response.body?.errors?.[0].message).to.be.eq(locale.__('user.error.invalid-jwt'));
    expect(data).to.be.null;
  });

  it('should return Hello World', async () => {
    requestMaker.refreshAuth();
    const response = await requestMaker.postGraphQL<{ hello: string }>(HelloQuery);
    const hello = response.body.data?.hello;
    expect(hello).to.be.eq('Hello World');
    expect(response.body.errors).to.be.undefined;
  });
});
