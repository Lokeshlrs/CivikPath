import connectDB from '../config/db.js';
import { Procedure } from '../models/Procedure.js';
import { ProcedureStep } from '../models/ProcedureStep.js';
import { GovernmentSource } from '../models/GovernmentSource.js';
import { generateGuidedCivicService } from '../services/guidedAiService.js';

const runPhase5cTests = async () => {
  console.log('🧪 Starting Phase 5C — Official Source Coverage & Step-Level Provenance Test Suite...');
  await connectDB();

  // Create a clean test procedure
  const testProc = await Procedure.create({
    title: 'Test Provenance Procedure',
    description: 'Procedure to test step-level source verification logic',
    serviceType: 'Test',
    jurisdiction: 'Test Corporation',
    state: 'Maharashtra',
    district: 'Amravati',
    city: 'Amravati',
    status: 'published',
    sourceStatus: 'demo',
  });

  // Create test sources with different verification states
  const verifiedApprovedSource = await GovernmentSource.create({
    sourceName: 'Verified & Approved Government Portal',
    department: 'Revenue Department',
    service: 'Certificate Service',
    officialDomain: 'amravati.gov.in',
    sourceUrl: 'https://amravati.gov.in/en/service/certificate',
    sourceStatus: 'verified',
    verificationStatus: 'approved',
  });

  const reviewRequiredSource = await GovernmentSource.create({
    sourceName: 'Review Required Source',
    department: 'Health Dept',
    officialDomain: 'amravati.gov.in',
    sourceUrl: 'https://amravati.gov.in/en/health',
    sourceStatus: 'review_required',
    verificationStatus: 'pending',
  });

  const demoSource = await GovernmentSource.create({
    sourceName: 'Demo Source',
    department: '[Department]',
    officialDomain: '[Official Domain - Demo]',
    sourceUrl: '[Official Government Source]',
    sourceStatus: 'demo',
    verificationStatus: 'pending',
  });

  const rejectedSource = await GovernmentSource.create({
    sourceName: 'Rejected Source',
    department: 'Unapproved Dept',
    officialDomain: 'unverified-site.com',
    sourceUrl: 'https://unverified-site.com/doc',
    sourceStatus: 'rejected',
    verificationStatus: 'rejected',
  });

  // Create Steps linking to various sources
  const stepNoSource = await ProcedureStep.create({
    procedureId: testProc._id,
    nodeId: 'step-no-src',
    title: 'Step 1: Database Only Step',
    description: 'Step with no source linked',
    order: 1,
    sourceIds: [],
  });

  const stepVerifiedSource = await ProcedureStep.create({
    procedureId: testProc._id,
    nodeId: 'step-verified-src',
    title: 'Step 2: Verified Source Step',
    description: 'Step linked to verified & approved source',
    order: 2,
    sourceIds: [verifiedApprovedSource._id],
  });

  const stepReviewRequiredSource = await ProcedureStep.create({
    procedureId: testProc._id,
    nodeId: 'step-review-src',
    title: 'Step 3: Review Required Source Step',
    description: 'Step linked to review required source',
    order: 3,
    sourceIds: [reviewRequiredSource._id],
  });

  const stepDemoSource = await ProcedureStep.create({
    procedureId: testProc._id,
    nodeId: 'step-demo-src',
    title: 'Step 4: Demo Source Step',
    description: 'Step linked to demo source',
    order: 4,
    sourceIds: [demoSource._id],
  });

  const stepRejectedSource = await ProcedureStep.create({
    procedureId: testProc._id,
    nodeId: 'step-rejected-src',
    title: 'Step 5: Rejected Source Step',
    description: 'Step linked to rejected source',
    order: 5,
    sourceIds: [rejectedSource._id],
  });

  console.log('\n--- EXECUTING TEST SUITE ---');

  // TEST 1: Database step with no verified source
  console.log('\nTEST 1: Database step with no verified source');
  const resNoSource = await generateGuidedCivicService('Test Provenance Procedure');
  const s1 = resNoSource.roadmap.find((s) => s.title === stepNoSource.title);
  console.log('Result Provenance:', s1.provenance);
  console.log('Result Sources:', s1.sources);
  const pass1 = s1.provenance.database === true && s1.provenance.officialSourceVerified === false && s1.sources.length === 0;
  console.log(`TEST 1 STATUS: ${pass1 ? '✅ PASS' : '❌ FAIL'}`);

  // TEST 2: Step with verified + approved GovernmentSource
  console.log('\nTEST 2: Step with verified + approved GovernmentSource');
  const s2 = resNoSource.roadmap.find((s) => s.title === stepVerifiedSource.title);
  console.log('Result Provenance:', s2.provenance);
  console.log('Result Sources:', s2.sources);
  const pass2 = s2.provenance.database === true && s2.provenance.officialSourceVerified === true && s2.sources.length === 1;
  console.log(`TEST 2 STATUS: ${pass2 ? '✅ PASS' : '❌ FAIL'}`);

  // TEST 3: Step with review_required source
  console.log('\nTEST 3: Step with review_required source');
  const s3 = resNoSource.roadmap.find((s) => s.title === stepReviewRequiredSource.title);
  console.log('Result Provenance:', s3.provenance);
  console.log('Result Sources:', s3.sources);
  const pass3 = s3.provenance.officialSourceVerified === false && s3.sources.length === 0;
  console.log(`TEST 3 STATUS: ${pass3 ? '✅ PASS' : '❌ FAIL'}`);

  // TEST 4: Step with demo source
  console.log('\nTEST 4: Step with demo source');
  const s4 = resNoSource.roadmap.find((s) => s.title === stepDemoSource.title);
  console.log('Result Provenance:', s4.provenance);
  const pass4 = s4.provenance.officialSourceVerified === false && s4.sources.length === 0;
  console.log(`TEST 4 STATUS: ${pass4 ? '✅ PASS' : '❌ FAIL'}`);

  // TEST 5: Step with rejected source
  console.log('\nTEST 5: Step with rejected source');
  const s5 = resNoSource.roadmap.find((s) => s.title === stepRejectedSource.title);
  console.log('Result Provenance:', s5.provenance);
  const pass5 = s5.provenance.officialSourceVerified === false && s5.sources.length === 0;
  console.log(`TEST 5 STATUS: ${pass5 ? '✅ PASS' : '❌ FAIL'}`);

  // TEST 6: General verified Amravati services source attached to procedure but NOT explicitly attached to step
  console.log('\nTEST 6: General verified source attached to procedure but NOT explicitly to step');
  const resAmravati = await generateGuidedCivicService('I want to register a new small retail store in Amravati');
  const amravatiStep1 = resAmravati.roadmap[0];
  console.log('Procedure Sources:', resAmravati.sources.map((s) => s.url));
  console.log('Step 1 Provenance:', amravatiStep1.provenance);
  console.log('Step 1 Sources:', amravatiStep1.sources);
  const pass6 = resAmravati.sources.length > 0 && amravatiStep1.provenance.officialSourceVerified === false && amravatiStep1.sources.length === 0;
  console.log(`TEST 6 STATUS: ${pass6 ? '✅ PASS' : '❌ FAIL'}`);

  // Cleanup test procedure & sources
  await Procedure.deleteOne({ _id: testProc._id });
  await ProcedureStep.deleteMany({ procedureId: testProc._id });
  await GovernmentSource.deleteMany({ _id: { $in: [verifiedApprovedSource._id, reviewRequiredSource._id, demoSource._id, rejectedSource._id] } });

  console.log('\n🏁 Phase 5C Backend Provenance Test Suite Complete.');
  process.exit(0);
};

runPhase5cTests().catch((err) => {
  console.error('❌ Test execution error:', err);
  process.exit(1);
});
