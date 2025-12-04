import app from './app';
import { logger } from './utils';
import { dbInstance, appConfig } from './config';
import mongoose from 'mongoose'; // Import mongoose for connection close

const PORT = appConfig.port;

let server: any; // Declare server variable to hold the http.Server instance

(async () => {
  try {
    await dbInstance(); // Connect to MongoDB

    server = app.listen(PORT, () => {
      logger.info(`🚀 Server is running on port ${PORT}`);
      logger.info(
        `📊 Health check available at: http://localhost:${PORT}/healthz`
      );
      logger.info(
        `📚 API docs available at: http://localhost:${PORT}/api-docs`
      );
      logger.info(`🌍 Environment: ${appConfig.env}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
})();

// Function to handle graceful shutdown
const gracefulShutdown = async (signal: string) => {
  logger.info(`Received ${signal}. Initiating graceful shutdown...`);

  // Close the HTTP server
  server.close(async (err: any) => {
    if (err) {
      logger.error('Error closing HTTP server:', err);
      process.exit(1);
    }
    logger.info('HTTP server closed.');

    // Close MongoDB connection
    try {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed.');
    } catch (dbErr) {
      logger.error('Error closing MongoDB connection:', dbErr);
      process.exit(1);
    }

    logger.info('Application gracefully shut down.');
    process.exit(0);
  });

  // Force close if server hasn't exited within a timeout
  setTimeout(() => {
    logger.error('Forcing shutdown after timeout.');
    process.exit(1);
  }, 10000); // 10 seconds timeout
};

// Listen for termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
