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

  it('respects the requested item limit', async () => {
    const response = await request(app)
      .get('/api/sentences?page=1&limit=100')
      .expect(200);

    expect(response.body.items.length).toBeLessThanOrEqual(100);
    expect(response.body.page).toBe(1);
    expect(response.body.limit).toBe(100);
  });

  it('can start a sentence batch from an exact position', async () => {
    const response = await request(app)
      .get('/api/sentences?startPosition=37&limit=20')
      .expect(200);

    expect(response.body.items).toHaveLength(20);
    expect(response.body.startPosition).toBe(37);
    expect(response.body.endPosition).toBe(56);
    expect(response.body.items[0].position).toBe(37);
  });

  it('returns one sentence by its id', async () => {
    const response = await request(app).get('/api/sentences/46044').expect(200);

    expect(response.body.id).toBe(46044);
    expect(response.body.frText).toBe(
      "L'imagination affecte tous les aspects de notre vie.",
    );
    expect(response.body.enText).toBe(
      'Imagination affects every aspect of our lives.',
    );
  });

  it('returns sentence ranges for browsing', async () => {
    const response = await request(app).get('/api/sentence-ranges').expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0]).toMatchObject({
      rangeNumber: 1,
      startPosition: 1,
      endPosition: 100,
      sentenceCount: 100,
    });
  });
});
