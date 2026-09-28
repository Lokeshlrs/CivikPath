import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import connectDB from '../config/db.js';
import { User } from '../models/User.js';
import { CivicTask } from '../models/CivicTask.js';
import { Procedure } from '../models/Procedure.js';
import { ProcedureStep } from '../models/ProcedureStep.js';
import { Dependency } from '../models/Dependency.js';
import { DocumentRequirement } from '../models/DocumentRequirement.js';
import { GovernmentSource } from '../models/GovernmentSource.js';
import { UserProgress } from '../models/UserProgress.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    console.log('🌱 Connecting to MongoDB Atlas for database seeding...');
    await connectDB();

    console.log('🧹 Clearing existing seed data...');
    await User.deleteMany({ email: { $in: ['citizen@example.com', 'admin@civicpath.gov.in'] } });
    await GovernmentSource.deleteMany({ officialDomain: '[Official Domain - Demo]' });
    await Procedure.deleteMany({ title: 'Trade License Registration' });
    
    // Create Users
    console.log('👤 Creating demo accounts (Citizen & Admin)...');
    const citizenPasswordHash = await bcrypt.hash('Password123!', 10);
    const adminPasswordHash = await bcrypt.hash('AdminPassword123!', 10);

    const citizenUser = await User.create({
      name: 'Demo Citizen',
      email: 'citizen@example.com',
      passwordHash: citizenPasswordHash,
      role: 'citizen',
      location: {
        state: 'Maharashtra',
        district: 'Amravati',
        city: 'Amravati',
      },
    });

    const adminUser = await User.create({
      name: 'System Administrator',
      email: 'admin@civicpath.gov.in',
      passwordHash: adminPasswordHash,
      role: 'admin',
      location: {
        state: 'Maharashtra',
        district: 'Amravati',
        city: 'Amravati',
      },
    });

    // Create Demo Government Sources
    console.log('🏛️ Creating generic demo government sources...');
    const demoSource1 = await GovernmentSource.create({
      department: '[Department]',
      service: '[Government Service]',
      officialDomain: '[Official Domain - Demo]',
      sourceUrl: '[Official Government Source]',
      sourceType: 'portal',
      sourceStatus: 'demo',
      verificationStatus: 'pending',
    });

    const demoSource2 = await GovernmentSource.create({
      department: '[Department]',
      service: '[Government Service]',
      officialDomain: '[Official Domain - Demo]',
      sourceUrl: '[Official Application Link]',
      sourceType: 'portal',
      sourceStatus: 'demo',
      verificationStatus: 'pending',
    });

    // Create Procedure
    console.log('📋 Creating generic demo procedure roadmap...');
    const procedure = await Procedure.create({
      title: 'Trade License Registration',
      description: 'Standard municipal procedure for commercial establishment registration.',
      serviceType: 'Business License',
      jurisdiction: 'Municipal Corporation',
      state: 'Maharashtra',
      district: 'Amravati',
      city: 'Amravati',
      status: 'published',
      sourceStatus: 'demo',
      version: '1.0',
    });

    // Create Steps
    console.log('🗺️ Creating procedure steps...');
    const step1 = await ProcedureStep.create({
      procedureId: procedure._id,
      nodeId: '1',
      title: 'Submit Application Form',
      description: 'Complete online application form with personal and business details.',
      order: 1,
      status: 'completed',
      department: '[Department]',
      locationMode: 'Online Portal',
      nextStep: 'Document Verification',
      sourceIds: [demoSource1._id],
    });

    const step2 = await ProcedureStep.create({
      procedureId: procedure._id,
      nodeId: '2',
      title: 'Document Verification & Inspection',
      description: 'Submit mandatory documents for official verification by local authorities.',
      order: 2,
      status: 'current',
      department: '[Department]',
      locationMode: 'Municipal Office',
      nextStep: 'Fee Payment & Approval',
      sourceIds: [demoSource1._id, demoSource2._id],
    });

    const step3 = await ProcedureStep.create({
      procedureId: procedure._id,
      nodeId: '3',
      title: 'Fee Payment & Final License Issuance',
      description: 'Pay applicable government fee and receive verified digital registration certificate.',
      order: 3,
      status: 'pending',
      department: '[Department]',
      locationMode: 'Online Portal',
      nextStep: 'Procedure Complete',
      sourceIds: [demoSource2._id],
    });

    // Create Step Dependencies
    console.log('🔗 Creating step dependencies...');
    await Dependency.create({
      procedureId: procedure._id,
      fromStepId: step1._id,
      toStepId: step2._id,
      dependencyType: 'prerequisite',
      description: 'Step 1 must be submitted before inspection.',
    });

    await Dependency.create({
      procedureId: procedure._id,
      fromStepId: step2._id,
      toStepId: step3._id,
      dependencyType: 'prerequisite',
      description: 'Step 2 must be verified before payment.',
    });

    // Create Generic Document Requirements
    console.log('📄 Creating generic document requirements...');
    await DocumentRequirement.create({
      stepId: step2._id,
      name: '[Required Document 1]',
      description: 'Generic placeholder for identity or address verification document.',
      required: true,
      sourceId: demoSource1._id,
      sourceStatus: 'demo',
    });

    await DocumentRequirement.create({
      stepId: step2._id,
      name: '[Required Document 2]',
      description: 'Generic placeholder for premises proof or ownership document.',
      required: true,
      sourceId: demoSource1._id,
      sourceStatus: 'demo',
    });

    await DocumentRequirement.create({
      stepId: step3._id,
      name: '[Required Document 3]',
      description: 'Generic placeholder for fee receipt or authorization certificate.',
      required: true,
      sourceId: demoSource2._id,
      sourceStatus: 'demo',
    });

    // Create User Task & Progress
    console.log('🎯 Creating demo user task & progress record...');
    const task = await CivicTask.create({
      userId: citizenUser._id,
      title: 'Register new small retail store',
      procedureId: procedure._id,
      location: {
        state: 'Maharashtra',
        district: 'Amravati',
        city: 'Amravati',
      },
      answers: {
        businessType: 'Retail',
        area: 'Below 500 sq ft',
      },
    });

    // Seed Water Connection Application (Phase 6A catalog item)
    console.log('💧 Seeding Water Connection Application catalog service...');
    await Procedure.deleteMany({ title: 'Water Connection Application' });
    const waterProcedure = await Procedure.create({
      title: 'Water Connection Application',
      description: 'Statutory municipal process for new domestic and commercial water connection in Amravati.',
      serviceType: 'Public Utilities',
      jurisdiction: 'Water Supply Department',
      state: 'Maharashtra',
      district: 'Amravati',
      city: 'Amravati',
      status: 'published',
      sourceStatus: 'demo',
      version: '1.0',
    });

    await ProcedureStep.create({
      procedureId: waterProcedure._id,
      nodeId: 'water-step-1',
      title: 'Submit Water Application Form',
      description: 'Fill and submit new water connection form at Municipal Water Dept.',
      order: 1,
      department: 'Water Supply Department',
      locationMode: 'Municipal Office',
      sourceIds: [],
    });

    await ProcedureStep.create({
      procedureId: waterProcedure._id,
      nodeId: 'water-step-2',
      title: 'Site Plumbing Inspection',
      description: 'Municipal engineer inspects premises plumbing layout.',
      order: 2,
      department: 'Water Supply Department',
      locationMode: 'Field Visit',
      sourceIds: [],
    });

    await ProcedureStep.create({
      procedureId: waterProcedure._id,
      nodeId: 'water-step-3',
      title: 'Water Meter Installation & Fee Payment',
      description: 'Pay prescribed connection fees and install authorized water meter.',
      order: 3,
      department: 'Water Supply Department',
      locationMode: 'Online Portal',
      sourceIds: [],
    });

    await CivicTask.create({
      userId: citizenUser._id,
      title: 'Water Connection Application',
      procedureId: waterProcedure._id,
      location: {
        state: 'Maharashtra',
        district: 'Amravati',
        city: 'Amravati',
      },
    });

    await UserProgress.create({
      userId: citizenUser._id,
      civicTaskId: task._id,
      procedureId: procedure._id,
      completedSteps: [step1._id],
      currentStepId: step2._id,
      percentage: 65,
    });

    console.log('✅ Database Seeding Completed Successfully!');
    console.log('--------------------------------------------------');
    console.log('Citizen Login Credentials:');
    console.log('  Email: citizen@example.com');
    console.log('  Password: Password123!');
    console.log('Admin Login Credentials:');
    console.log('  Email: admin@civicpath.gov.in');
    console.log('  Password: AdminPassword123!');
    console.log('--------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error Seeding Database:', error);
    process.exit(1);
  }
};

seedDatabase();
