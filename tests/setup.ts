import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from '../src/app';
import { IncomingMessage, Server, ServerResponse } from 'http';
dotenv.config();
export let server: Server<
  typeof IncomingMessage,
  typeof ServerResponse
> | null = null;
beforeAll(async () => {
  try {
    const uri = process.env.MONGODB_URI + '_test';
    await mongoose.connect(uri, { dbName: 'db_name_test' });
    server = app.listen(0); // random available port
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
});
afterAll(async () => {
  if (mongoose.connection && mongoose.connection.db) {
    await mongoose.connection.db.dropDatabase();
  }
  await mongoose.disconnect();
  if (server) {
    server.close();
  }
});
