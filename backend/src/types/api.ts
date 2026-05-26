export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  startPosition: number;
  endPosition: number;
}
export interface ErrorResponse {
  error: {
    message: string;
    statusCode: number;
  };
}
