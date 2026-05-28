import { app } from './app';
import { env } from './config/env';

app.listen(env.port, env.host, () => {
  console.log(`ecouter-api listening at http://${env.host}:${env.port}`);
});
