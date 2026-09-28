import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import { User } from '../models/User.js';
import { CivicTask } from '../models/CivicTask.js';
import { Procedure } from '../models/Procedure.js';
import { ProcedureStep } from '../models/ProcedureStep.js';
import { Dependency } from '../models/Dependency.js';
import { DocumentRequirement } from '../models/DocumentRequirement.js';
import { GovernmentSource } from '../models/GovernmentSource.js';
import { VerificationReview } from '../models/VerificationReview.js';
import { UserProgress } from '../models/UserProgress.js';
import { SourceChange } from '../models/SourceChange.js';

dotenv.config();

const checkCollections = async () => {
  try {
    await connectDB();

    console.log('\n📊 Checking MongoDB Collections & Seed Data Status:');
    console.log('--------------------------------------------------');

    const collections = [
      { name: 'users', model: User },
      { name: 'civictasks', model: CivicTask },
      { name: 'procedures', model: Procedure },
      { name: 'proceduresteps', model: ProcedureStep },
      { name: 'dependencies', model: Dependency },
      { name: 'documentrequirements', model: DocumentRequirement },
      { name: 'governmentsources', model: GovernmentSource },
      { name: 'verificationreviews', model: VerificationReview },
      { name: 'userprogress', model: UserProgress },
      { name: 'sourcechanges', model: SourceChange },
    ];

    let totalDocs = 0;
    for (const item of collections) {
      const count = await item.model.countDocuments();
      totalDocs += count;
      console.log(`  • Collection [${item.name.padEnd(20)}]: ${count} documents`);
    }

    console.log('--------------------------------------------------');
    console.log(`Total DB Documents Across Collections: ${totalDocs}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking database collections:', error);
    process.exit(1);
  }
};

checkCollections();
