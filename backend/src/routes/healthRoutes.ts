// health route for monitoring the health of the API

import { Router } from 'express';

export const healthRoutes = Router();

healthRoutes.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'ecouter-api',
  });
});
