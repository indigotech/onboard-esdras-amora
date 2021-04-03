import { expect } from 'chai';
import { ASTNode, print } from 'graphql';
import * as request from 'supertest';
import { ServerError } from '@core/error/base.error';
import { JwtService } from '@core/jwt.service';
import { UserTokenData } from '@domain/model';
import Container from 'typedi';

interface GraphQLResponse<T> extends request.Response {
  body: {
    data: T | null;
    errors?: ServerError[];
  };
}

export class RequestMaker {
  constructor(
    private readonly jwtService: JwtService = Container.get(JwtService),
    private readonly port = process.env.PORT ?? 4000,
    private token = '',
  ) {}

  refreshAuth(options: Partial<UserTokenData> = {}): string {
    const payload: UserTokenData = {
      userId: options.userId || '1',
    };

    const jwtResponse = this.jwtService.sign(payload, true);
    expect(jwtResponse).to.not.have.lengthOf(0);

    this.token = jwtResponse;
    return this.token;
  }

  postGraphQL = <T>(query: ASTNode, variables?: any, expectedStatus = 200): Promise<GraphQLResponse<T>> => {
    const agent = request(`http://localhost:${this.port}`).post('/graphql');

    agent.set('Content-Type', 'application/json');

    if (this.token) {
      agent.set('authorization', this.token);
    }

    return agent.send({ query: print(query), variables }).expect(this.checkStatus(expectedStatus));
  };

  private checkStatus(expectedStatus: number): (res: any) => any {
    const assertion = (res: any): void => {
      expect(res).to.be.not.undefined;
      expect(res.statusCode).to.equal(
        expectedStatus,
        `Response status does not match for ${res.req.method} ${res.req.path} \n ${JSON.stringify(res.body)}`,
      );
    };

    return assertion;
  }
}
