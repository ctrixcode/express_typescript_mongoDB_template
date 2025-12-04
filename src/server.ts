import app from './app';
import { logger } from './utils';
import { dbInstance, appConfig } from './config';

const PORT = appConfig.port;

(async () => {
  await dbInstance();
  app.listen(PORT, () => {
    logger.info(`🚀 Server is running on port ${PORT}`);
    logger.info(
      `📊 Health check available at: http://localhost:${PORT}/healthz`
    );
    logger.info(`📚 API docs available at: http://localhost:${PORT}/api-docs`);
    logger.info(`🌍 Environment: ${appConfig.env}`);
  });
})();
