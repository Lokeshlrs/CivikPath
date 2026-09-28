import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure environment variables from server/.env are loaded regardless of current working directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

let persistentMemoryServer = null;

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const mongoURI = process.env.MONGODB_URI;

  if (mongoURI) {
    const maskedURI = mongoURI.replace(/\/\/(.*):(.*)@/, '//***:***@');
    console.log(`[Database] Attempting connection to MongoDB (${maskedURI})...`);

    try {
      const conn = await mongoose.connect(mongoURI, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
        dbName: 'civicpath',
      });

      console.log(`[Database] ✅ Primary MongoDB Connected Successfully!`);
      console.log(`[Database] Host: ${conn.connection.host}`);
      console.log(`[Database] Database Name: ${conn.connection.name}`);
      return conn;
    } catch (primaryError) {
      const maskedURI = mongoURI.replace(/\/\/(.*):(.*)@/, '//***:***@');
      console.warn(`[Database Warning] Primary connection to (${maskedURI}) failed: ${primaryError.message}`);

      if (process.env.ALLOW_LOCAL_DB !== 'true') {
        throw new Error(
          `[Database Error] Failed to connect to primary database (${maskedURI}). Silent fallback is disabled. Set ALLOW_LOCAL_DB=true in server/.env for explicit local development fallback.`
        );
      }

      console.log('[Database] ⚠️ Explicit ALLOW_LOCAL_DB=true environment flag set. Falling back to local development MongoDB...');
    }
  }

  // Fallback ONLY allowed if ALLOW_LOCAL_DB === 'true' or MONGODB_URI is not set
  try {
    const conn = await mongoose.connect('mongodb://127.0.0.1:27017/civicpath', {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`[Database] ✅ Connected to Local MongoDB: ${conn.connection.host} / ${conn.connection.name}`);
    return conn;
  } catch (localError) {
    if (!persistentMemoryServer) {
      persistentMemoryServer = await MongoMemoryServer.create({
        instance: { port: 27017, dbName: 'civicpath' },
      });
    }
    const memoryUri = persistentMemoryServer.getUri();
    const conn = await mongoose.connect(memoryUri, { dbName: 'civicpath' });
    console.log(`[Database] ✅ Standalone Embedded DB Connected: ${conn.connection.host} / ${conn.connection.name}`);
    return conn;
  }
};

export default connectDB;
