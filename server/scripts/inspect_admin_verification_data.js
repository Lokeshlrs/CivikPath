import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const ATLAS_URI = process.env.MONGODB_URI;

async function inspectAdminVerificationData() {
  const conn = await mongoose.createConnection(ATLAS_URI, { dbName: 'civicpath' }).asPromise();
  const db = conn.db;

  console.log('\n==================================================');
  console.log('🔍 INSPECTING VERIFICATION REVIEWS IN ATLAS');
  console.log('==================================================\n');

  const reviews = await db.collection('verificationreviews').find({}).toArray();
  console.log(`Total VerificationReview records: ${reviews.length}\n`);

  reviews.forEach((r, idx) => {
    console.log(`REVIEW #${idx + 1}:`);
    console.log(`- ID: ${r._id}`);
    console.log(`- Procedure/Service: ${r.procedureTitle || r.service || r.procedureName || 'N/A'}`);
    console.log(`- Source Domain/URL: ${r.sourceDomain || r.sourceUrl || 'N/A'}`);
    console.log(`- Documents:`, r.documents || r.requiredDocuments || []);
    console.log(`- Status: ${r.status}`);
    console.log('--------------------------------------------------');
  });

  const sources = await db.collection('governmentsources').find({}).toArray();
  console.log(`\nTotal GovernmentSource records: ${sources.length}`);
  const placeholderSources = sources.filter(s => 
    s.officialDomain?.includes('Demo') || 
    s.sourceName?.includes('Demo') || 
    s.service?.includes('Government Service') ||
    s.department?.includes('Department') && s.department.includes('[')
  );
  console.log(`Placeholder GovernmentSource records: ${placeholderSources.length}`);

  await conn.close();
  process.exit(0);
}

inspectAdminVerificationData();
