

import type { Request, Response } from "express";

// the notFoundhandler is the last function in the chain, and is called when no route matches the request. 

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    error: {
      message: `Route ${req.path} wasn't found!`,
      statusCode: 404
    }
  });
}
