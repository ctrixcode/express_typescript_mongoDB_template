import { logger } from '../utils';

export const requestLogger = (req: any, _: any, next: any) => {
  const clientIP = req.ip === '::1' ? 'localhost' : req.ip;
  logger.http(`${req.method} ${req.url} - ${clientIP}`);
  next();
};
