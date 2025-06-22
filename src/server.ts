import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { logger } from './utils';
import { dbInstance } from './config';

const PORT = process.env.PORT || 4000;

(async () => {
  // await dbInstance();
  app.listen(PORT, () => {
    logger.info(`🚀 Server is running on port ${PORT}`);
    logger.info(
      `📊 Health check available at: http://localhost:${PORT}/healthz`
    );
    logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
})();
