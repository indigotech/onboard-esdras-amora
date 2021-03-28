import * as request from 'supertest';
import { expect } from 'chai';

describe('GraphQL - HelloResolver - Hello', () => {
  const requestMaker = request(`http://localhost:5000`).post('/graphql').set('Accept', 'application/json');

  it('should return hello world', async () => {
    const response = await requestMaker
      .send({
        query: '{ hello }',
      })
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.data.hello).to.be.eq('hello world');
  });
});
