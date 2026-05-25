import type { PaginatedResponse } from '../types/api';

export function paginateItems<T>(
  items: T[],
  page: number,
  limit: number,
): PaginatedResponse<T> {
  const pageSize =
    Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 100;
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pageNumber =
    Number.isFinite(page) && page > 0
      ? Math.min(Math.floor(page), totalPages)
      : 1;

  const startIndex = (pageNumber - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const pageItems = items.slice(startIndex, endIndex);

  return {
    items: pageItems,
    page: pageNumber,
    limit: pageSize,
    total,
    totalPages,
    startPosition: pageItems.length === 0 ? 0 : startIndex + 1,
    endPosition: pageItems.length === 0 ? 0 : startIndex + pageItems.length,
  };
}
