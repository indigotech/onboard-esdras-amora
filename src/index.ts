import 'reflect-metadata';
import { Server } from './server';
import { Container } from 'typedi';
import { useContainer as useClassValidatorContainer } from 'class-validator';
import { useContainer as useTypeContainer } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();
useClassValidatorContainer(Container);
useTypeContainer(Container);

const main = async () => {
  const server = new Server();
  await server.connectDb();
  await server.run();
};

main();
