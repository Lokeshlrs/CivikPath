import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import { GovernmentSource } from '../models/GovernmentSource.js';
import { VerificationReview } from '../models/VerificationReview.js';

dotenv.config();

const seedAmravatiVerified = async () => {
  try {
    await connectDB();
    const url = 'https://amravati.gov.in/en/services/';

    await GovernmentSource.deleteMany({ sourceUrl: url });

    const source = await GovernmentSource.create({
      sourceName: 'Services | District Amravati, Government of Maharashtra | India',
      department: 'District Collectorate Amravati',
      service: 'District Amravati Citizen Services Portal',
      serviceType: 'Public Citizen Services',
      location: { state: 'Maharashtra', district: 'Amravati', city: 'Amravati' },
      officialDomain: 'amravati.gov.in',
      domain: 'amravati.gov.in',
      sourceUrl: url,
      url: url,
      sourceStatus: 'verified',
      verificationStatus: 'approved',
      contentHash: '8ed9a53e18bbd9fba036f0982a60288271c6d3d1dde0db56a1c7c6441de88985',
      extractedContent: {
        title: 'Services | District Amravati, Government of Maharashtra | India',
        metaDescription: 'Official Citizen Services portal for District Amravati',
        headers: ['Services', 'Right To Service Act', 'Land Records & Digitally Signed 7/12', 'Caste Certificate & Birth Certificate'],
        cleanText: 'District Amravati Government of Maharashtra Official Services Portal. Key official services available: Right To Service Act, Land Records (7/12 & 8A extracts), Caste Certificate, Birth Certificate, e-Hakk, Revenue Court Cases, National Social Assistance Programme (NSAP).',
        wordCount: 42,
      },
      lastCheckedAt: new Date(),
      lastVerifiedAt: new Date(),
      reviewerNotes: 'Verified official portal',
    });

    console.log(`✅ Seeded Verified Amravati Source ID: ${source._id}`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding verified source:', err);
    process.exit(1);
  }
};

seedAmravatiVerified();
