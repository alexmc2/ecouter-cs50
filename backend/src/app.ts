import cors from 'cors';
import express from 'express';
import { env } from './config/env';

import { healthRoutes } from './routes/healthRoutes';
import { sentenceRoutes } from './routes/sentenceRoutes';
import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFoundHandler';

export const app = express();

app.use(
  cors({
    origin: env.corsOrigins,
  }),
);
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({
    service: 'ecouter-api',
    routes: [
      {
        name: 'Health check',
        method: 'GET',
        path: '/health',
      },
      {
        name: 'List sentences',
        method: 'GET',
        path: '/api/sentences',
      },
      {
        name: 'List sentence ranges',
        method: 'GET',
        path: '/api/sentence-ranges',
      },
      {
        name: 'Get sentence by ID',
        method: 'GET',
        path: '/api/sentences/:sentenceId',
      },
    ],
  });
});

app.use(healthRoutes);
app.use(sentenceRoutes);
app.use(notFoundHandler);
app.use(errorHandler);
