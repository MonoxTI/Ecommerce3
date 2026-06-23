import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(`[ERROR] ${err.message}`);

  const statusCode =
    err.message.includes('not found') ? 404 :
    err.message.includes('already') ? 409 :
    err.message.includes('Invalid') ? 401 : 500;

  res.status(statusCode).json({
    message: err.message || 'Internal server error',
  });
};