import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import {
  getVerifiedSources,
  getVerifiedSourceById,
  searchVerifiedSources,
} from '../services/verifiedSourceRetrievalService.js';
import { ingestSourceUrl } from '../services/sourceIngestionService.js';
import { GovernmentSource } from '../models/GovernmentSource.js';

dotenv.config();

const runPhase3cTests = async () => {
  console.log('🧪 Starting CivicPath Phase 3C Verified Source Retrieval Test Suite...');
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
    // Setup test sources with various lifecycle statuses in MongoDB Atlas
    await GovernmentSource.deleteMany({ sourceUrl: { $regex: 'test-phase3c-' } });

    const sourceVerified = await GovernmentSource.create({
      sourceName: 'Official Verified Maharashtra Gazette Portal',
      department: 'Revenue & Forest Department',
      service: '7/12 Land Records Verification',
      officialDomain: 'maharashtra.gov.in',
      domain: 'maharashtra.gov.in',
      sourceUrl: 'https://maharashtra.gov.in/test-phase3c-verified',
      sourceStatus: 'verified',
      verificationStatus: 'approved',
      extractedContent: {
        title: 'Official Verified Maharashtra Gazette Portal',
        cleanText: 'Official Maharashtra Land Records 7/12 extract and Digitally Signed 8A certificate portal.',
        headers: ['7/12 Extract Portal', 'Digitally Signed Certificate'],
      },
    });

    const sourceReviewRequired = await GovernmentSource.create({
      sourceName: 'Unreviewed Government Draft Policy',
      department: 'Department of Industries',
      officialDomain: 'maharashtra.gov.in',
      sourceUrl: 'https://maharashtra.gov.in/test-phase3c-review-required',
      sourceStatus: 'review_required',
      verificationStatus: 'pending',
      extractedContent: { cleanText: 'Draft policy pending administrator review.' },
    });

    const sourceDemo = await GovernmentSource.create({
      sourceName: 'Demo Mock Data Source',
      department: '[Department]',
      officialDomain: '[Official Domain - Demo]',
      sourceUrl: 'https://example-demo.gov.in/test-phase3c-demo',
      sourceStatus: 'demo',
      verificationStatus: 'pending',
      extractedContent: { cleanText: 'Demo placeholder data.' },
    });

    const sourceUnverified = await GovernmentSource.create({
      sourceName: 'Unverified Portal',
      department: 'State Transport',
      officialDomain: 'parivahan.gov.in',
      sourceUrl: 'https://parivahan.gov.in/test-phase3c-unverified',
      sourceStatus: 'discovered',
      verificationStatus: 'pending',
      extractedContent: { cleanText: 'Unverified transport data.' },
    });

    const sourceRejected = await GovernmentSource.create({
      sourceName: 'Rejected Source',
      department: 'Urban Development',
      officialDomain: 'mumbai.gov.in',
      sourceUrl: 'https://mumbai.gov.in/test-phase3c-rejected',
      sourceStatus: 'rejected',
      verificationStatus: 'rejected',
      extractedContent: { cleanText: 'Rejected submission data.' },
    });

    const sourceInactive = await GovernmentSource.create({
      sourceName: 'Inactive Legacy Portal',
      department: 'Municipal Corporation',
      officialDomain: 'amravati.gov.in',
      sourceUrl: 'https://amravati.gov.in/test-phase3c-inactive',
      sourceStatus: 'inactive',
      verificationStatus: 'pending',
      extractedContent: { cleanText: 'Inactive legacy system data.' },
    });

    // -------------------------------------------------------------
    // Test A: Verified Source IS Returned
    // -------------------------------------------------------------
    const verifiedList = await getVerifiedSources();
    const foundVerified = verifiedList.some((s) => s.sourceId === sourceVerified._id.toString());
    assert(foundVerified === true, 'Test A: Verified & Approved source IS returned by retrieval layer');

    // -------------------------------------------------------------
    // Test B: review_required Source is NOT Returned
    // -------------------------------------------------------------
    const foundReviewRequired = verifiedList.some((s) => s.sourceId === sourceReviewRequired._id.toString());
    assert(foundReviewRequired === false, 'Test B: "review_required" source is NOT returned');

    // -------------------------------------------------------------
    // Test C: demo Source is NOT Returned
    // -------------------------------------------------------------
    const foundDemo = verifiedList.some((s) => s.sourceId === sourceDemo._id.toString());
    assert(foundDemo === false, 'Test C: "demo" source is NOT returned');

    // -------------------------------------------------------------
    // Test D: unverified Source is NOT Returned
    // -------------------------------------------------------------
    const foundUnverified = verifiedList.some((s) => s.sourceId === sourceUnverified._id.toString());
    assert(foundUnverified === false, 'Test D: "unverified" source is NOT returned');

    // -------------------------------------------------------------
    // Test E: rejected Source is NOT Returned
    // -------------------------------------------------------------
    const foundRejected = verifiedList.some((s) => s.sourceId === sourceRejected._id.toString());
    assert(foundRejected === false, 'Test E: "rejected" source is NOT returned');

    // -------------------------------------------------------------
    // Test F: inactive Source is NOT Returned
    // -------------------------------------------------------------
    const foundInactive = verifiedList.some((s) => s.sourceId === sourceInactive._id.toString());
    assert(foundInactive === false, 'Test F: "inactive" source is NOT returned');

    // -------------------------------------------------------------
    // Test G: Non-Government URL Cannot Enter Retrieval Layer
    // -------------------------------------------------------------
    const ingestFake = await ingestSourceUrl({ url: 'https://example.com/malicious' });
    assert(ingestFake.success === false, 'Test G: Non-government URL cannot enter ingestion or retrieval layer', ingestFake.message);

    // -------------------------------------------------------------
    // Test H: Official Domain Without Admin Approval CANNOT Be Retrieved
    // -------------------------------------------------------------
    const unapprovedGet = await getVerifiedSourceById(sourceReviewRequired._id);
    assert(unapprovedGet === null, 'Test H: Official .gov.in domain source without admin approval CANNOT be retrieved by ID (returns null / 403)');

    // -------------------------------------------------------------
    // Test I: Search & Attribution Metadata for Real Source
    // -------------------------------------------------------------
    const searchResult = await searchVerifiedSources('7/12');
    const matched = searchResult.results.find((r) => r.sourceId === sourceVerified._id.toString());
    
    assert(
      matched !== undefined &&
      matched.attribution.verificationStatus === '✓ Official Source Verified' &&
      matched.attribution.url === sourceVerified.sourceUrl,
      'Test I: Search returned verified result with full attribution metadata'
    );

    // Clean up test documents
    await GovernmentSource.deleteMany({ sourceUrl: { $regex: 'test-phase3c-' } });

    console.log('--------------------------------------------------');
    console.log(`📊 Phase 3C Test Results: ${passed} PASSED, ${failed} FAILED`);

    if (failed === 0) {
      console.log('🎉 ALL PHASE 3C VERIFIED RETRIEVAL TESTS PASSED SUCCESSFULLY!');
      process.exit(0);
    } else {
      console.error('❌ SOME TESTS FAILED.');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error executing Phase 3C test suite:', error);
    process.exit(1);
  }
};

runPhase3cTests();
