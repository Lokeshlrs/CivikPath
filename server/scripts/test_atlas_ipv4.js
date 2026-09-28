import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const uris = [
  process.env.MONGODB_URI,
  'mongodb+srv://sitlanilokesh123_db_user:bcnWByDcS6Jx88av@cluster0.sz3tvt2.mongodb.net/civicpath?retryWrites=true&w=majority',
  'mongodb://sitlanilokesh123_db_user:bcnWByDcS6Jx88av@cluster0-shard-00-00.sz3tvt2.mongodb.net:27017,cluster0-shard-00-01.sz3tvt2.mongodb.net:27017,cluster0-shard-00-02.sz3tvt2.mongodb.net:27017/civicpath?ssl=true&replicaSet=atlas-ruoxui-shard-0&authSource=admin',
];

async function testAll() {
  console.log('🔍 TESTING ATLAS CONNECTIONS WITH IPv4 & VARIOUS OPTIONS...\n');

  for (let i = 0; i < uris.length; i++) {
    const uri = uris[i];
    if (!uri) continue;
    const masked = uri.replace(/\/\/(.*):(.*)@/, '//***:***@');
    console.log(`[Option ${i + 1}] Trying URI: ${masked}`);

    // Try standard options
    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
        dbName: 'civicpath',
        family: 4, // Force IPv4
      });
      console.log(`✅ SUCCESS with Option ${i + 1}! Connected Host: ${conn.connection.host}, DB: ${conn.connection.name}`);
      await mongoose.disconnect();
      return uri;
    } catch (err) {
      console.log(`❌ Option ${i + 1} standard IPv4 failed: ${err.message}`);
    }

    // Try tlsAllowInvalidCertificates
    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
        dbName: 'civicpath',
        tlsAllowInvalidCertificates: true,
        family: 4,
      });
      console.log(`✅ SUCCESS with Option ${i + 1} (tlsAllowInvalidCertificates)! Host: ${conn.connection.host}, DB: ${conn.connection.name}`);
      await mongoose.disconnect();
      return uri;
    } catch (err) {
      console.log(`❌ Option ${i + 1} TLS fallback failed: ${err.message}`);
    }
  }

  console.log('\n❌ All Atlas connection attempts failed.');
  process.exit(1);
}

testAll();
