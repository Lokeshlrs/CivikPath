import connectDB from '../config/db.js';
import { generateCivicAnswer } from '../services/civicAnswerService.js';
import dotenv from 'dotenv';

dotenv.config();

async function testQa() {
  await connectDB();

  console.log('\n==================================================');
  console.log('🧪 TESTING Q&A ENDPOINT WITH KNOWN & FEE QUESTIONS');
  console.log('==================================================\n');

  // Test 1: Known Answerable Question
  const q1 = 'What documents are required for Passport Application?';
  console.log(`Q1: "${q1}"`);
  const res1 = await generateCivicAnswer(q1);
  console.log('RES1 Grounded:', res1.grounded);
  console.log('RES1 Sources Count:', res1.sources.length);
  if (res1.sources.length > 0) {
    console.log('RES1 Source Domain:', res1.sources[0].officialDomain);
  }
  console.log('RES1 Answer Text:\n', res1.answer);
  console.log('--------------------------------------------------\n');

  // Test 2: Fee Question Not in Verified Source
  const q2 = 'What is the exact current processing fee for a service that is not specified in the verified source?';
  console.log(`Q2: "${q2}"`);
  const res2 = await generateCivicAnswer(q2);
  console.log('RES2 Grounded:', res2.grounded);
  console.log('RES2 Sources Count:', res2.sources.length);
  console.log('RES2 Answer Text:\n', res2.answer);
  console.log('--------------------------------------------------\n');

  process.exit(0);
}

testQa();
