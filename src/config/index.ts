import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 4000,
  logLevel: process.env.LOG_LEVEL || 'info',

  mongo: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/test',
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'supersecretjwtkey',
    accessTokenExpiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || '59m',
    refreshTokenExpiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || '7d',
  },

  encryptionKey:
    process.env.ENCRYPTION_KEY || 'thisisasecretkeyfor32byteslong!', // Default for development and testing

  cors: {
    allowedOrigins: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',')
      : ['http://localhost:3000'],
  },
};

// Freeze the config object to make it immutable
export const appConfig = Object.freeze(config);

// Validate encryption key length
if (appConfig.encryptionKey.length !== 32) {
  console.error(
    'ERROR: ENCRYPTION_KEY must be a 32-byte string. Please set it in your .env file.'
  );
  process.exit(1);
}

// Re-export other config modules for convenience
export { default as dbInstance } from './db';
