import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils';

export const requestLogger = (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const clientIP = req.ip === '::1' ? 'localhost' : req.ip;
  logger.http(`${req.method} ${req.url} - ${clientIP}`);
  next();
};
