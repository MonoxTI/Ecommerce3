import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Always log the full error so we can see what went wrong
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.error('ERROR:', err.message);
  console.error('STACK:', err.stack);
  if (err.original) console.error('DB ERROR:', err.original.message);
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const statusCode =
    err.message?.includes('not found')   ? 404 :
    err.message?.includes('already')     ? 409 :
    err.message?.includes('Invalid')     ? 401 :
    err.message?.includes('required')    ? 400 : 500;

  res.status(statusCode).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && {
      detail: err.original?.message || err.stack,
    }),
  });
};