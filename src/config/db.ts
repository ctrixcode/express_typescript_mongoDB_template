import { logger } from '../utils';
import mongoose from 'mongoose';
import { appConfig } from './index';

const dbInstance = async () => {
  try {
    logger.info('Connecting to MongoDB...');
    await mongoose.connect(appConfig.mongo.uri);
    logger.info('✅ Successfully connected to MongoDB');
  } catch (error) {
    logger.error('❌ Error connecting to MongoDB:', error);
    process.exit(1); // Exit the process with failure
  }
};

export default dbInstance;
