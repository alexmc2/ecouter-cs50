import { app } from './app';
import { env } from './config/env';

app.listen(env.port, '127.0.0.1', () => {
  console.log(`ecouter-api listening at http://127.0.0.1:${env.port}`);
});
