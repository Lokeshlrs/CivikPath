import { MongoMemoryServer } from 'mongodb-memory-server';

const startPersistentDatabase = async () => {
  try {
    console.log('[Local DB Service] Starting standalone MongoDB server instance on port 27017...');
    const mongod = await MongoMemoryServer.create({
      instance: {
        port: 27017,
        dbName: 'civicpath',
      },
    });

    const uri = mongod.getUri();
    console.log(`[Local DB Service] ✅ MongoDB Standalone Server online at: ${uri}`);
    console.log(`[Local DB Service] Database Name: civicpath`);
    console.log('[Local DB Service] Database is ready for backend connections and seed scripts.');
  } catch (error) {
    console.error('[Local DB Service Error] Could not start MongoDB standalone server:', error.message);
    process.exit(1);
  }
};

startPersistentDatabase();
