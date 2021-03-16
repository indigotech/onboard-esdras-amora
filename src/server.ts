import * as express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { ConnectionOptions, createConnection } from 'typeorm';
import { Service } from 'typedi';
import { Container } from 'typedi';

@Service()
export class Server {
  public async run() {
    const schema = await buildSchema({
      resolvers: [__dirname + '/**/*.resolver{.ts,.js}'],
      validate: false,
      container: Container,
    });

    const port = +(process.env.PORT || 4000);

    const server = new ApolloServer({
      schema,
    });

    const app = express();

    server.applyMiddleware({ app });

    return app.listen({ port }, () => {
      console.log(`server running at port: ${port}`);
    });
  }

  public async connect() {
    const options: ConnectionOptions = {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: false,
    };

    return await createConnection(options);
  }
}
