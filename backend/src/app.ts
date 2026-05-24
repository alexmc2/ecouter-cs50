import cors from 'cors';
import express from 'express';
import { env } from './config/env';

import { healthRoutes } from './routes/healthRoutes';

export const app = express();

app.use(
  cors({
    origin: env.corsOrigin,
  }),
);
app.use(express.json());

app.use(healthRoutes);
