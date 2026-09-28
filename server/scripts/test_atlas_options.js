import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const uri1 = process.env.MONGODB_URI;
const uri2 = 'mongodb+srv://sitlanilokesh123_db_user:bcnWByDcS6Jx88av@cluster0.sz3tvt2.mongodb.net/civicpath?retryWrites=true&w=majority';

async function test() {
  console.log('Testing Atlas URI 1...');
  if (uri1) {
    try {
      const conn = await mongoose.connect(uri1, { serverSelectionTimeoutMS: 5000, tlsAllowInvalidCertificates: true, dbName: 'civicpath' });
      console.log('✅ URI 1 SUCCESS Connected to:', conn.connection.host, conn.connection.name);
      await mongoose.disconnect();
      return;
    } catch(e) {
      console.log('❌ URI 1 FAIL:', e.message);
    }
  }

  console.log('Testing Atlas URI 2...');
  try {
    const conn = await mongoose.connect(uri2, { serverSelectionTimeoutMS: 5000, tlsAllowInvalidCertificates: true, dbName: 'civicpath' });
    console.log('✅ URI 2 SUCCESS Connected to:', conn.connection.host, conn.connection.name);
    await mongoose.disconnect();
    return;
  } catch(e) {
    console.log('❌ URI 2 FAIL:', e.message);
  }
}

test();
