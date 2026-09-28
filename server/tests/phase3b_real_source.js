import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import { isOfficialGovernmentDomain } from '../services/domainValidator.js';
import { isSafeUrl } from '../services/ssrfProtection.js';
import { fetchUrlSafely, ingestSourceUrl } from '../services/sourceIngestionService.js';
import { GovernmentSource } from '../models/GovernmentSource.js';
import { VerificationReview } from '../models/VerificationReview.js';
import { SourceChange } from '../models/SourceChange.js';
import { User } from '../models/User.js';

dotenv.config();

const runPhase3bTest = async () => {
  console.log('🏛️ Starting Phase 3B Real Official Government Source End-to-End Test...');
  console.log('--------------------------------------------------');

  await connectDB();

  const realGovUrl = 'https://amravati.gov.in/en/services/';
  console.log(`📡 Target Real Government URL: ${realGovUrl}`);

  // Step 1: Security & Domain Validation
  const domainCheck = isOfficialGovernmentDomain(realGovUrl);
  console.log(`[Domain Check] Hostname: ${domainCheck.hostname}, Is Valid: ${domainCheck.isValid}`);

  const ssrfCheck = isSafeUrl(realGovUrl);
  console.log(`[SSRF Check] Is Safe: ${ssrfCheck.isSafe}`);

  if (!domainCheck.isValid || !ssrfCheck.isSafe) {
    console.error('❌ Validation failed before fetch!');
    process.exit(1);
  }

  // Step 2: Ingest Real URL
  console.log('\n📥 Ingesting Real Official Source via POST /api/sources/ingest logic...');
  
  // Clean up any previous test runs for this exact URL
  await GovernmentSource.deleteMany({ sourceUrl: realGovUrl });

  const ingestResult = await ingestSourceUrl({
    url: realGovUrl,
    department: 'District Collectorate Amravati',
    serviceType: 'Public Citizen Services',
    location: { state: 'Maharashtra', district: 'Amravati', city: 'Amravati' },
  });

  console.log(`[Ingest Result] Success: ${ingestResult.success}, Status Code: ${ingestResult.statusCode}`);
  console.log(`[Ingest Message]: ${ingestResult.message}`);

  if (!ingestResult.success || !ingestResult.data) {
    console.error('❌ Real source ingestion failed!');
    process.exit(1);
  }

  const ingestedSource = ingestResult.data;
  console.log(`[MongoDB Document ID]: ${ingestedSource._id}`);
  console.log(`[Source Name]: ${ingestedSource.sourceName}`);
  console.log(`[Domain]: ${ingestedSource.officialDomain}`);
  console.log(`[Content Hash]: ${ingestedSource.contentHash}`);
  console.log(`[Source Status]: ${ingestedSource.sourceStatus}`);
  console.log(`[Verification Status]: ${ingestedSource.verificationStatus}`);
  
  if (ingestedSource.extractedContent) {
    console.log(`[Extracted Title]: ${ingestedSource.extractedContent.title}`);
    console.log(`[Extracted Word Count]: ${ingestedSource.extractedContent.wordCount}`);
    console.log(`[Extracted Headers]: ${JSON.stringify(ingestedSource.extractedContent.headers || [])}`);
    console.log(`[Clean Text Snippet]: ${ingestedSource.extractedContent.cleanText.slice(0, 250)}...`);
  }

  // Verify DB state prior to approval
  if (ingestedSource.sourceStatus !== 'review_required' || ingestedSource.verificationStatus !== 'pending') {
    console.error('❌ Ingested source did NOT start in review_required / pending state!');
    process.exit(1);
  }
  console.log('✅ Confirmed source is in "review_required" & "pending" status before admin approval.');

  // Step 3: Admin Approval Workflow
  console.log('\n🛡️ Simulating Admin Verification Approval...');
  
  const adminUser = await User.findOne({ role: 'admin' });
  const reviewerId = adminUser ? adminUser._id : new mongoose.Types.ObjectId();

  const updatedSource = await GovernmentSource.findByIdAndUpdate(
    ingestedSource._id,
    {
      sourceStatus: 'verified',
      verificationStatus: 'approved',
      reviewedBy: reviewerId,
      reviewedAt: new Date(),
      lastVerifiedAt: new Date(),
      reviewerNotes: 'Verified official District Amravati Government of Maharashtra portal',
    },
    { new: true }
  );

  const reviewRecord = await VerificationReview.create({
    sourceId: ingestedSource._id,
    reviewerId: reviewerId,
    action: 'approved',
    extractedData: ingestedSource.extractedContent || {},
    reviewerComment: 'Verified official District Amravati Government of Maharashtra portal',
  });

  console.log(`[Verification Status After Approval]: ${updatedSource.sourceStatus} / ${updatedSource.verificationStatus}`);
  console.log(`[VerificationReview MongoDB Document ID]: ${reviewRecord._id}`);

  // Step 4: Change Detection Check
  console.log('\n🔄 Executing Source Change Check (POST /api/sources/:id/check)...');
  const checkResult = await ingestSourceUrl({
    url: realGovUrl,
    department: 'District Collectorate Amravati',
    serviceType: 'Public Citizen Services',
  });

  console.log(`[Check Result] Is Changed: ${checkResult.isChanged}`);
  console.log(`[Check Message]: ${checkResult.message}`);

  const changeCount = await SourceChange.countDocuments({ sourceId: ingestedSource._id });
  console.log(`[SourceChange Documents in Atlas]: ${changeCount}`);

  // Step 5: Final MongoDB Atlas Count & Verification Summary
  const atlasSource = await GovernmentSource.findById(ingestedSource._id);
  const atlasReview = await VerificationReview.findById(reviewRecord._id);

  console.log('\n📊 Final MongoDB Atlas Verification Summary:');
  console.log('--------------------------------------------------');
  console.log(`• GovernmentSource ID: ${atlasSource._id}`);
  console.log(`• Source Status: ${atlasSource.sourceStatus}`);
  console.log(`• Verification Status: ${atlasSource.verificationStatus}`);
  console.log(`• Official Domain: ${atlasSource.officialDomain}`);
  console.log(`• Extracted Title: ${atlasSource.extractedContent.title}`);
  console.log(`• VerificationReview ID: ${atlasReview._id}`);
  console.log(`• Verification Review Action: ${atlasReview.action}`);
  console.log('--------------------------------------------------');
  console.log('🎉 REAL OFFICIAL GOVERNMENT SOURCE TEST COMPLETED SUCCESSFULLY!');

  process.exit(0);
};

runPhase3bTest();
