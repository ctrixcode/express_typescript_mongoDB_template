import { Router } from 'express';
import { logger } from '../utils';

const router = Router();

router.get('/healthz', (_, res) => {
  logger.info('Health check requested');
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

export default router; 