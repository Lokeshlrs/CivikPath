import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import { Procedure } from '../models/Procedure.js';
import { GovernmentSource } from '../models/GovernmentSource.js';
import { CivicTask } from '../models/CivicTask.js';
import { User } from '../models/User.js';
import { generateGuidedCivicService } from '../services/guidedAiService.js';

dotenv.config();

async function runTaskHydrationTest() {
  console.log('\n==================================================');
  console.log('🧪 Starting Phase 7C — Task Hydration & Official URL Resolution Test');
  console.log('==================================================\n');

  await connectDB();

  // Step 1: Fetch a procedure with a verified officialSourceId (e.g. PAN Card Application)
  const panProcedure = await Procedure.findOne({ title: /PAN Card Application/i }).populate('officialSourceId').lean();
  if (!panProcedure) {
    console.error('❌ Could not find PAN Card Application procedure in DB');
    process.exit(1);
  }

  console.log(`--- TEST 1: Verify Procedure Has Verified officialSourceId ---`);
  console.log(`Procedure Title: "${panProcedure.title}"`);
  console.log(`sourceStatus: "${panProcedure.sourceStatus}"`);
  console.log(`officialSourceId: "${panProcedure.officialSourceId?.sourceName}"`);
  console.log(`Official URL: "${panProcedure.officialSourceId?.sourceUrl || panProcedure.officialSourceId?.url}"`);

  if (!panProcedure.officialSourceId || !panProcedure.officialSourceId.sourceUrl) {
    console.error('❌ FAIL: Procedure does not have a valid verified officialSourceId URL');
    process.exit(1);
  }
  console.log('  ✓ TEST 1 PASSED: Procedure has verified officialSourceId with valid official URL');

  // Step 2: Ensure test user and an existing CivicTask referencing that procedureId
  let testUser = await User.findOne({ email: 'citizen@example.com' });
  if (!testUser) {
    testUser = await User.create({
      name: 'Test Citizen',
      email: 'citizen@example.com',
      passwordHash: '$2b$10$e8W/8V0x9lZtP7fE4O0pQ.aJz4c7M2b/O6hW0kL5p5A5b5c5d5e5f',
      role: 'citizen',
    });
  }

  let existingTask = await CivicTask.findOne({ userId: testUser._id, procedureId: panProcedure._id });
  if (!existingTask) {
    existingTask = await CivicTask.create({
      userId: testUser._id,
      procedureId: panProcedure._id,
      title: panProcedure.title,
      description: panProcedure.description,
      status: 'active',
    });
  }

  console.log(`\n--- TEST 2: Existing CivicTask Linked to Procedure ID ---`);
  console.log(`Task ID: "${existingTask._id}"`);
  console.log(`Procedure ID: "${existingTask.procedureId}"`);

  // Step 3: Resolve procedure guidance using procedureId / taskId
  const guidedRes = await generateGuidedCivicService(existingTask.procedureId.toString());

  console.log(`\n--- TEST 3: Hydrated Roadmap Receives Verified officialSourceUrl ---`);
  console.log(`Response Matched: ${guidedRes.matched}`);
  console.log(`Task Official Source URL: "${guidedRes.task?.officialSourceUrl}"`);

  if (!guidedRes.matched) {
    console.error('❌ FAIL: Failed to match existing task procedureId');
    process.exit(1);
  }

  if (guidedRes.task?.officialSourceUrl !== panProcedure.officialSourceId.sourceUrl) {
    console.error(`❌ FAIL: Expected officialSourceUrl "${panProcedure.officialSourceId.sourceUrl}" but received "${guidedRes.task?.officialSourceUrl}"`);
    process.exit(1);
  }
  console.log('  ✓ TEST 3 PASSED: Existing CivicTask correctly hydrates verified officialSourceUrl from MongoDB');

  // Step 4: Verify Step Provenance Rules (Phase 5C) Are Preserved
  console.log(`\n--- TEST 4: Step-Level Provenance Isolation (Phase 5C) ---`);
  const unverifiedStep = guidedRes.roadmap.find((s) => !s.provenance?.officialSourceVerified);
  console.log(`Unverified Step Found: "${unverifiedStep?.title}"`);
  console.log(`Unverified Step Provenance:`, unverifiedStep?.provenance);

  if (!unverifiedStep || unverifiedStep.provenance.officialSourceVerified !== false) {
    console.error('❌ FAIL: Step-level provenance rule violated — unverified step was auto-marked verified');
    process.exit(1);
  }
  console.log('  ✓ TEST 4 PASSED: Step-level provenance is strictly preserved');

  console.log(`\n==================================================`);
  console.log('🎉 PHASE 7C TASK HYDRATION TEST SUITE PASSED CLEANLY!');
  console.log('==================================================\n');

  await mongoose.connection.close();
  process.exit(0);
}

runTaskHydrationTest().catch(async (err) => {
  console.error('❌ Error during Task Hydration test:', err);
  await mongoose.connection.close();
  process.exit(1);
});
