import { describe, expect, it } from 'vitest';
import { paginateItems } from '../src/utils/pagination';

describe('pagination helper', () => {
  it('returns the first page of items', () => {
    const result = paginateItems([1, 2, 3, 4, 5], 1, 2);

    expect(result.items).toEqual([1, 2]);
    expect(result.startPosition).toBe(1);
    expect(result.endPosition).toBe(2);
  });

  it('returns the next slice for page two', () => {
    const result = paginateItems(['a', 'b', 'c', 'd'], 2, 2);

    expect(result.items).toEqual(['c', 'd']);
    expect(result.startPosition).toBe(3);
    expect(result.endPosition).toBe(4);
  });

  it('reports how many pages are available', () => {
    const result = paginateItems([1, 2, 3, 4, 5], 1, 2);

    expect(result.total).toBe(5);
    expect(result.totalPages).toBe(3);
  });
});
