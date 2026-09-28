import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import { matchCivicService } from '../services/civicMatcherService.js';
import { generateGuidedCivicService } from '../services/guidedAiService.js';
import { Procedure } from '../models/Procedure.js';
import { ProcedureStep } from '../models/ProcedureStep.js';
import { CivicTask } from '../models/CivicTask.js';
import { User } from '../models/User.js';

dotenv.config();

const runTests = async () => {
  console.log('🧪 Starting Performance & Catalog Expansion Automated Test Suite...\n');
  await connectDB();

  let passed = 0;
  let failed = 0;

  const assert = (condition, message) => {
    if (condition) {
      console.log(`  ✓ ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  };

  try {
    // TEST 1: Services catalog count >= 50
    console.log('--- TEST 1: Services Catalog Count ---');
    const totalProcedures = await Procedure.countDocuments({});
    assert(totalProcedures >= 50, `Catalog contains ${totalProcedures} procedures (Required >= 50)`);

    // TEST 2: Fast Procedure Matching Performance (< 300ms)
    console.log('\n--- TEST 2: Fast Procedure Matching Performance ---');
    const startTime = Date.now();
    const matchRes = await matchCivicService('apply for fresh passport');
    const matchDuration = Date.now() - startTime;
    assert(matchRes.matched === true, 'Fast matcher matched "apply for fresh passport"');
    assert(matchRes.procedure && matchRes.procedure.title.toLowerCase().includes('passport'), 'Matched procedure is Passport Application');
    assert(matchDuration < 300, `Matching executed in ${matchDuration}ms (Target < 300ms)`);

    // TEST 3: Search Aliases & Synonym Matching
    console.log('\n--- TEST 3: Search Aliases & Synonym Matching ---');
    const aliasRes1 = await matchCivicService('add wife name to ration card');
    assert(aliasRes1.matched === true && aliasRes1.procedure.title.includes('Ration Card'), 'Alias "add wife name to ration card" matched Ration Card Member Addition');

    const aliasRes2 = await matchCivicService('shetkari dakhla');
    assert(aliasRes2.matched === true && aliasRes2.procedure.title.includes('Agriculturist'), 'Alias "shetkari dakhla" matched Agriculturist Certificate');

    const aliasRes3 = await matchCivicService('gumasta license');
    assert(aliasRes3.matched === true && aliasRes3.procedure.title.includes('Shop & Establishment'), 'Alias "gumasta license" matched Shop & Establishment Registration');

    // TEST 4: Unknown Request (No Roadmap Reuse / No Fallback)
    console.log('\n--- TEST 4: Unknown Request Handling ---');
    const unknownRes = await generateGuidedCivicService('die');
    assert(unknownRes.matched === false, 'Unknown query "die" returned matched = false');
    assert(unknownRes.roadmap.length === 0, 'Roadmap array is empty (0 hallucinated steps)');
    assert(unknownRes.grounding.status === 'unverified', 'Grounding status is unverified');

    // TEST 5: Step Provenance Isolation (Phase 5C Rule)
    console.log('\n--- TEST 5: Step Provenance Isolation ---');
    const stepProvRes = await generateGuidedCivicService('Water Connection Ownership Change');
    assert(stepProvRes.matched === true, 'Service matched');
    assert(stepProvRes.grounding.databaseGrounded === true, 'databaseGrounded = true');
    assert(stepProvRes.grounding.officialSourceVerified === false, 'Procedure-level general source does NOT auto-verify steps');
    assert(stepProvRes.roadmap[0].provenance.officialSourceVerified === false, 'Step 1 officialSourceVerified = false when lacking step-level source');

    // TEST 6: Multi-Path & Independent Progress Creation
    console.log('\n--- TEST 6: Multi-Path & Independent Progress ---');
    const testUser = await User.findOne({ email: 'citizen@example.com' });
    const passportProc = await Procedure.findOne({ title: { $regex: /passport/i } });
    const incomeProc = await Procedure.findOne({ title: { $regex: /income/i } });

    assert(testUser !== null && passportProc !== null && incomeProc !== null, 'Found test user and catalog procedures');

    const task1 = await CivicTask.create({
      userId: testUser._id,
      procedureId: passportProc._id,
      title: passportProc.title,
      status: 'active',
    });

    const task2 = await CivicTask.create({
      userId: testUser._id,
      procedureId: incomeProc._id,
      title: incomeProc.title,
      status: 'active',
    });

    const userTasks = await CivicTask.find({ userId: testUser._id }).lean();
    const taskIds = userTasks.map((t) => (t.procedureId ? t.procedureId.toString() : t._id.toString()));
    assert(taskIds.includes(passportProc._id.toString()) && taskIds.includes(incomeProc._id.toString()), 'Both Passport and Income Certificate tasks exist independently in database');

    // TEST 7: Generation End-to-End Speed Benchmark (< 2-3s)
    console.log('\n--- TEST 7: End-to-End Generation Benchmark ---');
    const genStart = Date.now();
    const genRes = await generateGuidedCivicService('Fresh Passport Application');
    const genDuration = Date.now() - genStart;
    assert(genRes.matched === true && genRes.roadmap.length >= 3, 'Full roadmap generated with 3+ steps');
    assert(genDuration < 2000, `Full generation completed in ${genDuration}ms (Target < 2000ms)`);

    // Clean up test tasks created during test
    await CivicTask.deleteMany({ _id: { $in: [task1._id, task2._id] } });

    console.log(`\n==================================================`);
    console.log(`🏁 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log(`==================================================\n`);

    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('❌ Error executing automated tests:', err);
    process.exit(1);
  }
};

runTests();
