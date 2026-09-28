import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import { GovernmentSource } from '../models/GovernmentSource.js';
import { Procedure } from '../models/Procedure.js';
import { ProcedureStep } from '../models/ProcedureStep.js';
import { CivicTask } from '../models/CivicTask.js';
import { DocumentRequirement } from '../models/DocumentRequirement.js';
import { Dependency } from '../models/Dependency.js';

dotenv.config();

const auditDatabase = async () => {
  try {
    console.log('🔍 Connecting to MongoDB to run comprehensive Database Integrity Audit...');
    await connectDB();

    const sources = await GovernmentSource.find({}).lean();
    const procedures = await Procedure.find({}).lean();
    const steps = await ProcedureStep.find({}).lean();
    const tasks = await CivicTask.find({}).lean();
    const documents = await DocumentRequirement.find({}).lean();
    const dependencies = await Dependency.find({}).lean();

    // 1. Basic Counts
    const procedureCount = procedures.length;
    const stepCount = steps.length;
    const documentCount = documents.length;
    const dependencyCount = dependencies.length;
    const sourceCount = sources.length;

    // 2. Status Breakdown
    const verifiedProcedures = procedures.filter((p) => p.sourceStatus === 'verified').length;
    const databaseOnlyProcedures = procedures.filter((p) => p.sourceStatus === 'database_only').length;
    const reviewRequiredProcedures = procedures.filter((p) => p.sourceStatus === 'review_required').length;
    const unverifiedProcedures = procedures.filter((p) => p.sourceStatus === 'unverified' || p.sourceStatus === 'demo').length;

    // 3. Completeness Checks
    const proceduresWithoutSources = procedures.filter((p) => !p.officialSourceId && (!p.sources || p.sources.length === 0)).length;

    const procsWithStepsSet = new Set(steps.map((s) => s.procedureId?.toString()));
    const proceduresWithoutSteps = procedures.filter((p) => !procsWithStepsSet.has(p._id.toString())).length;

    const proceduresWithoutAliases = procedures.filter((p) => !Array.isArray(p.aliases) || p.aliases.length === 0).length;
    const proceduresWithoutKeywords = procedures.filter((p) => !Array.isArray(p.keywords) || p.keywords.length === 0).length;

    // 4. Duplicate Checks
    const procTitles = procedures.map((p) => p.title.toLowerCase().trim());
    const duplicateProcedures = procTitles.filter((item, index) => procTitles.indexOf(item) !== index).length;

    // 5. Orphan Checks
    const validProcIdsSet = new Set(procedures.map((p) => p._id.toString()));
    const stepsWithoutValidProc = steps.filter((s) => !validProcIdsSet.has(s.procedureId?.toString())).length;
    const orphanRecords = stepsWithoutValidProc + proceduresWithoutSteps;

    // Output Report
    console.log('\n==================================================');
    console.log('📊 CIVICPATH EXPANDED DATABASE AUDIT REPORT');
    console.log('==================================================');
    console.log(`- Procedure count:                 ${procedureCount}`);
    console.log(`- ProcedureStep count:             ${stepCount}`);
    console.log(`- DocumentRequirement count:       ${documentCount}`);
    console.log(`- Dependency count:                ${dependencyCount}`);
    console.log(`- GovernmentSource count:          ${sourceCount}`);
    console.log(`--------------------------------------------------`);
    console.log(`- Verified procedures:             ${verifiedProcedures}`);
    console.log(`- Database-only procedures:        ${databaseOnlyProcedures}`);
    console.log(`- Review-required procedures:      ${reviewRequiredProcedures}`);
    console.log(`- Unverified procedures:           ${unverifiedProcedures}`);
    console.log(`--------------------------------------------------`);
    console.log(`- Procedures without sources:      ${proceduresWithoutSources}`);
    console.log(`- Procedures without steps:        ${proceduresWithoutSteps}`);
    console.log(`- Procedures without aliases:      ${proceduresWithoutAliases}`);
    console.log(`- Procedures without keywords:     ${proceduresWithoutKeywords}`);
    console.log(`- Duplicate procedures:            ${duplicateProcedures}`);
    console.log(`- Orphan records:                  ${orphanRecords}`);
    console.log('==================================================\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error executing database audit:', err);
    process.exit(1);
  }
};

auditDatabase();
