import { expect } from 'chai';
import { ASTNode, print } from 'graphql';
import * as request from 'supertest';
import { ServerError } from '@core/error/base.error';

interface GraphQLResponse<T> extends request.Response {
  body: {
    data: T | null;
    errors?: ServerError[];
  };
}

export const postGraphQL = <T>(
  query: ASTNode,
  variables?: any,
  expectedStatus = 200,
  port = process.env.PORT ?? 4000,
): Promise<GraphQLResponse<T>> => {
  const agent = request(`http://localhost:${port}`).post('/graphql');

  agent.set('Content-Type', 'application/json');

  return agent.send({ query: print(query), variables }).expect(checkStatus(expectedStatus));
};

const checkStatus = (expectedStatus: number): ((res: any) => any) => {
  const assertion = (res: any): void => {
    expect(res).to.be.not.undefined;
    expect(res.statusCode).to.equal(
      expectedStatus,
      `Response status does not match for ${res.req.method} ${res.req.path} \n ${JSON.stringify(res.body)}`,
    );
  };

  return assertion;
};
