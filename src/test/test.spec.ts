import * as request from 'supertest';
import app from '@api';

describe('GraphQL - UserResolver - Create', () => {
  before(async () => {
    await app.run();
  });

  const requestMaker = request(`http://localhost:5000`).post('/graphql').set('Accept', 'application/json');

  it('should return -1 when the value is not present', async () => {
    await requestMaker
      .send({
        query: '{ hello }',
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .expect((res) => {
        console.log(res.body.data.hello);
      });
  });
});
