import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const atlasUri = process.env.MONGODB_URI;
const localUri = 'mongodb://127.0.0.1:27017/civicpath';

async function countCollections(conn, label) {
  try {
    const db = conn.db;
    const host = conn.host;
    const name = conn.name;
    console.log(`\n=== ${label} ===`);
    console.log(`Host: ${host}`);
    console.log(`Database Name: ${name}`);

    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    console.log(`Collections: ${collectionNames.join(', ')}`);

    const proceduresCount = collectionNames.includes('procedures') ? await db.collection('procedures').countDocuments() : 0;
    const stepsCount = collectionNames.includes('proceduresteps') ? await db.collection('proceduresteps').countDocuments() : 0;
    const docsCount = collectionNames.includes('documentrequirements') ? await db.collection('documentrequirements').countDocuments() : 0;
    const depsCount = collectionNames.includes('dependencies') ? await db.collection('dependencies').countDocuments() : 0;
    const sourcesCount = collectionNames.includes('governmentsources') ? await db.collection('governmentsources').countDocuments() : 0;
    const usersCount = collectionNames.includes('users') ? await db.collection('users').countDocuments() : 0;

    console.log(`Procedures: ${proceduresCount}`);
    console.log(`ProcedureSteps: ${stepsCount}`);
    console.log(`DocumentRequirements: ${docsCount}`);
    console.log(`Dependencies: ${depsCount}`);
    console.log(`GovernmentSources: ${sourcesCount}`);
    console.log(`Users: ${usersCount}`);

    return { host, name, proceduresCount, stepsCount, docsCount, depsCount, sourcesCount, usersCount };
  } catch (err) {
    console.error(`[${label} Error]:`, err.message);
    return null;
  }
}

async function diagnose() {
  console.log('🔍 DIAGNOSING ALL MONGODB ENVIRONMENTS...');
  
  // 1. Try Atlas
  if (atlasUri) {
    const masked = atlasUri.replace(/\/\/(.*):(.*)@/, '//***:***@');
    console.log(`Attempting Atlas Connection to: ${masked}`);
    try {
      const atlasConn = await mongoose.createConnection(atlasUri, { serverSelectionTimeoutMS: 5000 }).asPromise();
      await countCollections(atlasConn, 'MONGODB ATLAS DATABASE');
      await atlasConn.close();
    } catch (err) {
      console.log(`[Atlas Connection Failed]: ${err.message}`);
    }
  } else {
    console.log('No MONGODB_URI found in server/.env');
  }

  // 2. Try Local
  try {
    console.log(`Attempting Local MongoDB Connection to: ${localUri}`);
    const localConn = await mongoose.createConnection(localUri, { serverSelectionTimeoutMS: 3000 }).asPromise();
    await countCollections(localConn, 'LOCAL MONGODB DATABASE');
    await localConn.close();
  } catch (err) {
    console.log(`[Local Connection Failed]: ${err.message}`);
  }

  process.exit(0);
}

diagnose();
