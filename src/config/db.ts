import { logger } from '../utils';
import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  throw new Error('MONGODB_URI environment variable is required');
}

const dbInstance = async () => {
  try {
    logger.info('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    logger.info('✅ Successfully connected to MongoDB');
  } catch (error) {
    logger.error('❌ Error connecting to MongoDB:', error);
    process.exit(1); // Exit the process with failure
  }
};

export default dbInstance;
