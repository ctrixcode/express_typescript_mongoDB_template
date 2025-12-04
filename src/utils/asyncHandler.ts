import { Request, Response, NextFunction, RequestHandler } from 'express';

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

/**
 * A higher-order function to wrap async route handlers and catch errors.
 * This avoids the need for try-catch blocks in every async controller.
 * @param {AsyncRequestHandler} requestHandler - The async controller function.
 * @returns {RequestHandler} A standard Express request handler.
 */
export const asyncHandler =
  (requestHandler: AsyncRequestHandler): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(requestHandler(req, res, next)).catch(err => next(err));
  };
