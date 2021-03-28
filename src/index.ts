import { loadApp } from '@api';

declare let run: any;
process.on('unhandledRejection', (up) => {
  throw up;
});

loadApp().then(() => run?.());
