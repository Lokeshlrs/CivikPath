import connectDB from '../config/db.js';
import { GovernmentSource } from '../models/GovernmentSource.js';
import dotenv from 'dotenv';

dotenv.config();

async function inspectSources() {
  await connectDB();
  const sources = await GovernmentSource.find({}).lean();
  console.log(`\n==================================================`);
  console.log(`🔍 INSPECTING ALL ${sources.length} GOVERNMENT SOURCES IN DB`);
  console.log(`==================================================\n`);

  sources.forEach((s, idx) => {
    console.log(`SOURCE #${idx + 1}:`);
    console.log(`- ID: ${s._id}`);
    console.log(`- Title/Name: ${s.sourceName || s.extractedContent?.title || s.service || 'N/A'}`);
    console.log(`- Official Domain: ${s.officialDomain || s.domain || 'N/A'}`);
    console.log(`- URL: ${s.sourceUrl || s.url || 'N/A'}`);
    console.log(`- Source Status: ${s.sourceStatus}`);
    console.log(`- Verification Status: ${s.verificationStatus}`);
    console.log(`- Active/Approved: ${s.sourceStatus === 'verified' && s.verificationStatus === 'approved' ? 'YES' : 'NO'}`);
    console.log(`- Extracted Text Length: ${s.extractedContent?.cleanText ? s.extractedContent.cleanText.length : 0} chars`);
    if (s.extractedContent?.cleanText) {
      console.log(`- Text Snippet: "${s.extractedContent.cleanText.slice(0, 150).replace(/\n/g, ' ')}..."`);
    }
    console.log('--------------------------------------------------');
  });

  process.exit(0);
}

inspectSources();
