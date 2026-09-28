import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const ATLAS_URI = process.env.MONGODB_URI;

async function runFinalAtlasAudit() {
  const conn = await mongoose.createConnection(ATLAS_URI, { dbName: 'civicpath' }).asPromise();
  const db = conn.db;
  const host = conn.host;
  const dbName = conn.name;

  const procedures = await db.collection('procedures').countDocuments();
  const steps = await db.collection('proceduresteps').countDocuments();
  const docs = await db.collection('documentrequirements').countDocuments();
  const deps = await db.collection('dependencies').countDocuments();
  const sources = await db.collection('governmentsources').countDocuments();
  const users = await db.collection('users').countDocuments();
  const tasks = await db.collection('civictasks').countDocuments();
  const userprogress = await db.collection('userprogresses').countDocuments();

  console.log('\n==================================================');
  console.log('📊 FINAL DIRECT MONGODB ATLAS COLLECTION AUDIT');
  console.log('==================================================');
  console.log(`Atlas Connected:    YES`);
  console.log(`Runtime Host:       ${host}`);
  console.log(`Runtime Database:   ${dbName}`);
  console.log(`Procedures:         ${procedures}`);
  console.log(`Steps:              ${steps}`);
  console.log(`Documents:          ${docs}`);
  console.log(`Dependencies:       ${deps}`);
  console.log(`Sources:            ${sources}`);
  console.log(`Users:              ${users}`);
  console.log(`CivicTasks:         ${tasks}`);
  console.log(`UserProgress:       ${userprogress}`);
  console.log('==================================================\n');

  await conn.close();
  process.exit(0);
}

runFinalAtlasAudit();
