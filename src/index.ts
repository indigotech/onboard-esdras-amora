import { loadApp } from '@api';
import { UserSeed } from '@data/db/user.seed';

import Container from 'typedi';

declare let run: any;
process.on('unhandledRejection', (up) => {
  throw up;
});

const isTest = process.argv[1].indexOf('mocha') >= 0;
const isSeed = process.argv[2] == 'seed:user';

loadApp().then((server) => {
  if (isTest) {
    run();
  }
  if (isSeed) {
    const seed = Container.get(UserSeed);
    seed.exec().then(() => server.close());
  }
});
