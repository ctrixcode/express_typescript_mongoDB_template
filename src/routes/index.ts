import { Router } from 'express';
import { logger } from '../utils';
import exampleRoutes from './example.routes';

const router = Router();

/**
 * @swagger
 * /healthz:
 *   get:
 *     summary: Perform a health check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: The service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 uptime:
 *                   type: number
 *                   example: 123.45
 *                 environment:
 *                   type: string
 *                   example: development
 */
router.get('/healthz', (_, res) => {
  logger.info('Health check requested');
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Example routes
router.use('/examples', exampleRoutes);

export default router;
