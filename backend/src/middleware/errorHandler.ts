import type {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from 'express';

interface ErrorWithStatus extends Error {
  statusCode?: number;
}

export const errorHandler: ErrorRequestHandler = (
  error: ErrorWithStatus,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  console.error(error);

  const statusCode = error.statusCode ?? 500;
  const message =
    error.message ?? 'An unexpected occurred! Please try again later.';

  res.status(statusCode).json({
    error: {
      message,
      statusCode,
    },
  });
};
