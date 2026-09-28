import connectDB from '../config/db.js';
import { Procedure } from '../models/Procedure.js';
import { GovernmentSource } from '../models/GovernmentSource.js';
import dotenv from 'dotenv';

dotenv.config();

async function auditProcedures() {
  await connectDB();
  const procs = await Procedure.find({}).populate('officialSourceId').lean();
  const sources = await GovernmentSource.find({}).lean();

  console.log(`\n==================================================`);
  console.log(`🔍 AUDITING ALL ${procs.length} PROCEDURES IN MONGODB ATLAS`);
  console.log(`==================================================\n`);

  let verifiedCount = 0;
  let missingCount = 0;

  procs.forEach((p, idx) => {
    const src = p.officialSourceId;
    const hasVerifiedUrl = p.sourceStatus === 'verified' && src && (src.sourceUrl || src.url) && (src.sourceStatus === 'verified');
    if (hasVerifiedUrl) verifiedCount++;
    else missingCount++;

    console.log(`${idx + 1}. [${p.title}]`);
    console.log(`   - Department: ${p.department}`);
    console.log(`   - Procedure Source Status: ${p.sourceStatus}`);
    console.log(`   - Linked Source Name: ${src ? (src.sourceName || src.service || src.extractedContent?.title) : 'NONE'}`);
    console.log(`   - Linked Source URL: ${src ? (src.sourceUrl || src.url) : 'NONE'}`);
    console.log(`   - Linked Source Verification: ${src ? src.verificationStatus : 'N/A'}`);
    console.log(`   - Has Verified Official URL: ${hasVerifiedUrl ? '✅ YES' : '❌ NO'}`);
    console.log('--------------------------------------------------');
  });

  console.log(`\nSUMMARY:`);
  console.log(`- Verified Official URLs Present: ${verifiedCount} / ${procs.length}`);
  console.log(`- Unverified / Missing URLs: ${missingCount} / ${procs.length}`);

  process.exit(0);
}

auditProcedures();
