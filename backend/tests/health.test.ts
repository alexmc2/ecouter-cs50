import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../src/app';

describe('GET /', () => {
  it('returns an API route directory', async () => {
    const response = await request(app).get('/').expect(200);

    expect(response.body).toEqual({
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
});

describe('GET /health', () => {
  it('returns the health status of the API', async () => {
    const response = await request(app).get('/health').expect(200);

    expect(response.body).toEqual({
      status: 'ok',
      service: 'ecouter-api',
    });
  });
});
