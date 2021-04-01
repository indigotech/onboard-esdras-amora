import { loadApp } from '@api';

declare let run: any;
process.on('unhandledRejection', (up) => {
  throw up;
});

const isTest = process.argv[1].indexOf('mocha') >= 0;

loadApp().then(() => {
  if (isTest) {
    run();
  }
});
