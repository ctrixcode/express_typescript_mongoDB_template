import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * A higher-order function to wrap async route handlers and catch errors.
 * This avoids the need for try-catch blocks in every async controller.
 *
 * This generic implementation correctly infers the types for request parameters,
 * body, and query from the controller function that is passed, preserving
 * type safety throughout.
 *
 * @param fn The async controller function to wrap.
 * @returns A standard Express request handler.
 */
export const asyncHandler =
  <P, ResBody, ReqBody, ReqQuery>(
    fn: (
      req: Request<P, ResBody, ReqBody, ReqQuery>,
      res: Response<ResBody>,
      next: NextFunction
    ) => Promise<void>
  ): RequestHandler<P, ResBody, ReqBody, ReqQuery> =>
  (req, res, next) => {
    fn(req, res, next).catch(next);
  };
