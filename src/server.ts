import dotenv from 'dotenv';
import app from './app';
import { logger } from './utils';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  logger.info(`🚀 Server is running on port ${PORT}`);
  logger.info(`📊 Health check available at: http://localhost:${PORT}/healthz`);
  logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});