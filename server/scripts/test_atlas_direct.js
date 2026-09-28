import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const uri = process.env.MONGODB_URI;

async function testAtlasDirect() {
  console.log('🔍 Testing Direct Connection to MongoDB Atlas...');
  const masked = uri ? uri.replace(/\/\/(.*):(.*)@/, '//***:***@') : 'NONE';
  console.log(`URI: ${masked}`);

  try {
    const conn = await mongoose.connect(uri, {
      dbName: 'civicpath',
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    console.log(`✅ SUCCESS! Connected to Host: ${conn.connection.host}, DB Name: ${conn.connection.name}`);
    const collections = await conn.connection.db.listCollections().toArray();
    console.log(`Collections in ${conn.connection.name}:`, collections.map(c => c.name));
    
    const usersCount = await conn.connection.db.collection('users').countDocuments();
    const procsCount = await conn.connection.db.collection('procedures').countDocuments();
    console.log(`Atlas Users Count: ${usersCount}`);
    console.log(`Atlas Procedures Count: ${procsCount}`);

    const users = await conn.connection.db.collection('users').find({}, { projection: { email: 1, name: 1, role: 1 } }).toArray();
    console.log('Atlas Users:', users);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Connection Failed:', err.message);
    process.exit(1);
  }
}

testAtlasDirect();
