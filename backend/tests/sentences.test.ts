import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../src/app';

describe('sentence routes', () => {
  it('returns a paginated list of sentences', async () => {
    const response = await request(app).get('/api/sentences').expect(200);

    expect(Array.isArray(response.body.items)).toBe(true);
    expect(response.body.page).toBeDefined();
    expect(response.body.limit).toBeDefined();
    expect(response.body.total).toBeGreaterThan(0);
    expect(response.body.totalPages).toBeGreaterThan(0);
    expect(response.body.startPosition).toBe(1);
  });
});
