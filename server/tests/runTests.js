import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import { isOfficialGovernmentDomain } from '../services/domainValidator.js';
import { isSafeUrl } from '../services/ssrfProtection.js';
import { extractCleanText, calculateContentHash, ingestSourceUrl } from '../services/sourceIngestionService.js';
import { GovernmentSource } from '../models/GovernmentSource.js';
import { SourceChange } from '../models/SourceChange.js';
import { VerificationReview } from '../models/VerificationReview.js';

dotenv.config();

const runAllTests = async () => {
  console.log('🧪 Starting CivicPath Phase 3A Test Suite Execution...');
  console.log('--------------------------------------------------');

  await connectDB();

  let passed = 0;
  let failed = 0;

  const assert = (condition, testName, details = '') => {
    if (condition) {
      console.log(`✅ [PASS] ${testName} ${details ? `(${details})` : ''}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName} ${details ? `(${details})` : ''}`);
      failed++;
    }
  };

  try {
    // -------------------------------------------------------------
    // Test A: Valid Official Government URL
    // -------------------------------------------------------------
    const testA = isOfficialGovernmentDomain('https://india.gov.in/service/trade-license');
    assert(testA.isValid === true && testA.domain === 'india.gov.in', 'Test A: Valid official government URL allowed');

    // -------------------------------------------------------------
    // Test B: Non-Government URL
    // -------------------------------------------------------------
    const testB = isOfficialGovernmentDomain('https://example.com/fake-govt-page');
    assert(testB.isValid === false, 'Test B: Non-government URL rejected', testB.reason);

    // -------------------------------------------------------------
    // Test C: Localhost URL (SSRF Protection)
    // -------------------------------------------------------------
    const testC = isSafeUrl('http://localhost:5000/internal-admin');
    assert(testC.isSafe === false, 'Test C: Localhost URL blocked by SSRF protection', testC.reason);

    // -------------------------------------------------------------
    // Test D: Private IP (SSRF Protection)
    // -------------------------------------------------------------
    const testD = isSafeUrl('http://192.168.1.100/config');
    assert(testD.isSafe === false, 'Test D: Private IP blocked by SSRF protection', testD.reason);

    // -------------------------------------------------------------
    // Test E: Invalid URL Format
    // -------------------------------------------------------------
    const testE = isSafeUrl('htp://invalid-url-string-without-protocol');
    assert(testE.isSafe === false, 'Test E: Invalid URL format rejected', testE.reason);

    // -------------------------------------------------------------
    // Test F & G: Error Handling Helpers & Hash Extraction
    // -------------------------------------------------------------
    const textSample = '<html><head><title>Maharashtra Municipal Portal</title></head><body><h1>Services</h1><p>Trade license applications</p></body></html>';
    const extracted = extractCleanText(textSample);
    assert(extracted.title === 'Maharashtra Municipal Portal', 'Test F: Clean text and title extraction working');

    const hash1 = calculateContentHash(extracted.cleanText);
    assert(hash1.length === 64, 'Test G: SHA-256 Content hashing working');

    // -------------------------------------------------------------
    // Test H & I: Ingestion, Unchanged Source & SourceChange Detection
    // -------------------------------------------------------------
    const testGovUrl = 'https://amravati.gov.in/trade-licensing-portal';
    await GovernmentSource.deleteMany({ sourceUrl: testGovUrl });
    await SourceChange.deleteMany({});

    const initialMockHtml = '<html><head><title>Amravati Municipal Trade License</title></head><body><h1>Official Guidelines 2026</h1><p>Requirements: Form A, ID proof, Address proof.</p></body></html>';

    // First ingestion (New source with status review_required)
    const ingest1 = await ingestSourceUrl({
      url: testGovUrl,
      department: 'Municipal Corporation',
      serviceType: 'Trade Licensing',
      mockContent: initialMockHtml,
    });

    assert(
      ingest1.success === true && ingest1.isNew === true && ingest1.data.sourceStatus === 'review_required',
      'Test H1: Ingested new source with status "review_required"'
    );

    const sourceId = ingest1.data._id;

    // Second ingestion (Unchanged source)
    const ingest2 = await ingestSourceUrl({
      url: testGovUrl,
      department: 'Municipal Corporation',
      serviceType: 'Trade Licensing',
      mockContent: initialMockHtml,
    });

    assert(
      ingest2.success === true && ingest2.isChanged === false,
      'Test H2: Re-ingested unchanged source without creating duplicate SourceChange'
    );

    // Third ingestion (Modified content to trigger SourceChange detection)
    const updatedMockHtml = '<html><head><title>Amravati Municipal Trade License</title></head><body><h1>Official Guidelines 2026 UPDATED</h1><p>Requirements: Form A, ID proof, Address proof, Property Tax Receipt.</p></body></html>';

    const ingest3 = await ingestSourceUrl({
      url: testGovUrl,
      department: 'Municipal Corporation',
      serviceType: 'Trade Licensing',
      mockContent: updatedMockHtml,
    });

    assert(
      ingest3.success === true && ingest3.isChanged === true,
      'Test I1: Detected content change on existing government source'
    );

    const changeCount = await SourceChange.countDocuments({ sourceId });
    assert(changeCount > 0, 'Test I2: SourceChange document created in MongoDB Atlas', `Found ${changeCount} records`);

    // -------------------------------------------------------------
    // Test J: Verification Approval
    // -------------------------------------------------------------
    const sourceToVerify = await GovernmentSource.findByIdAndUpdate(
      sourceId,
      {
        sourceStatus: 'verified',
        verificationStatus: 'approved',
        lastVerifiedAt: new Date(),
      },
      { new: true }
    );

    assert(
      sourceToVerify.sourceStatus === 'verified' && sourceToVerify.verificationStatus === 'approved',
      'Test J: Source status updated to "verified" upon approval'
    );

    // -------------------------------------------------------------
    // Test K: Verification Rejection
    // -------------------------------------------------------------
    const sourceToReject = await GovernmentSource.findByIdAndUpdate(
      sourceId,
      {
        sourceStatus: 'rejected',
        verificationStatus: 'rejected',
      },
      { new: true }
    );

    assert(
      sourceToReject.sourceStatus === 'rejected' && sourceToReject.verificationStatus === 'rejected',
      'Test K: Source status updated to "rejected" upon rejection'
    );

    console.log('--------------------------------------------------');
    console.log(`📊 Phase 3A Test Results: ${passed} PASSED, ${failed} FAILED`);

    if (failed === 0) {
      console.log('🎉 ALL PHASE 3A TESTS PASSED SUCCESSFULLY!');
      process.exit(0);
    } else {
      console.error('❌ SOME TESTS FAILED.');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error executing test suite:', error);
    process.exit(1);
  }
};

runAllTests();
