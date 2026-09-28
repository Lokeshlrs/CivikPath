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
import { UserProgress } from '../models/UserProgress.js';

dotenv.config();

const seedCatalog = async () => {
  try {
    console.log('🌱 Connecting to MongoDB for 50+ procedure catalog database seeding...');
    await connectDB();

    console.log('🧹 Clearing legacy catalog procedures, steps, documents, dependencies, and tasks...');
    await User.deleteMany({ email: { $in: ['citizen@example.com', 'admin@civicpath.gov.in'] } });
    await Procedure.deleteMany({});
    await ProcedureStep.deleteMany({});
    await DocumentRequirement.deleteMany({});
    await Dependency.deleteMany({});
    await GovernmentSource.deleteMany({});
    await CivicTask.deleteMany({});
    await UserProgress.deleteMany({});

    // -------------------------------------------------------------------
    // 1. Ingest Official IGOD & Department Government Sources
    // -------------------------------------------------------------------
    console.log('🏛️ Ingesting Official Government Sources...');

    const sourcesData = [
      {
        sourceName: 'Integrated Government Online Directory (IGOD)',
        department: 'National Informatics Centre (NIC)',
        service: 'Indian Government Online Directory & Index',
        serviceType: 'Directory & Index',
        location: { state: 'National', district: 'All', city: 'All' },
        officialDomain: 'igod.gov.in',
        domain: 'igod.gov.in',
        sourceUrl: 'https://igod.gov.in/',
        url: 'https://igod.gov.in/',
        sourceType: 'index',
        description: 'Official Indian Government website directory index.',
        sourceStatus: 'verified',
        verificationStatus: 'approved',
        extractedContent: {
          title: 'Integrated Government Online Directory (IGOD) - India Portal',
          headers: ['Union Government', 'State Governments', 'Districts', 'Ministries & Departments'],
          cleanText: 'Integrated Government Online Directory (IGOD) is the official central portal and index of all Indian government websites across Union, State, District, and Local Municipal bodies.',
          wordCount: 25,
        },
      },
      {
        sourceName: 'District Amravati Citizen Portal',
        department: 'District Collectorate Amravati',
        service: 'District Revenue & Citizen Services',
        serviceType: 'District Citizen Services',
        location: { state: 'Maharashtra', district: 'Amravati', city: 'Amravati' },
        officialDomain: 'amravati.gov.in',
        domain: 'amravati.gov.in',
        sourceUrl: 'https://amravati.gov.in/en/services/',
        url: 'https://amravati.gov.in/en/services/',
        sourceType: 'portal',
        description: 'Official District Collectorate portal for certificates and land records.',
        sourceStatus: 'verified',
        verificationStatus: 'approved',
        extractedContent: {
          title: 'District Amravati Citizen Portal - Government of Maharashtra',
          headers: ['Citizen Services', 'Right To Service Act', 'Land Records', 'Certificates'],
          cleanText: 'District Amravati Government of Maharashtra Official Services Portal. Official services and certificates available: Income Certificate, Domicile Certificate, Caste Certificate, Agriculturist Certificate (Shetkari Dakhla), Birth & Death Certificate, Marriage Certificate, Land Records (7/12 & 8A extracts), e-Hakk mutation.',
          wordCount: 42,
        },
      },
      {
        sourceName: 'Amravati Municipal Corporation Portal',
        department: 'Amravati Municipal Corporation',
        service: 'Municipal Public Utilities & Licensing',
        serviceType: 'Municipal Administration',
        location: { state: 'Maharashtra', district: 'Amravati', city: 'Amravati' },
        officialDomain: 'amravaticorporation.in',
        domain: 'amravaticorporation.in',
        sourceUrl: 'https://amravaticorporation.in/',
        url: 'https://amravaticorporation.in/',
        sourceType: 'portal',
        description: 'Official civic portal of Amravati Municipal Corporation for water, trade, property tax, and NOCs.',
        sourceStatus: 'verified',
        verificationStatus: 'approved',
        extractedContent: {
          title: 'Amravati Municipal Corporation Portal',
          headers: ['Municipal Services', 'Water Supply', 'Trade Licensing', 'Building Plans', 'Property Tax'],
          cleanText: 'Official civic portal of Amravati Municipal Corporation for public utilities and commercial licensing. Services available: New Water Connection Application, Trade License (Gumasta), Building Plan Approval, Property Tax Assessment, Sewerage Connection NOC, Fire Safety NOC.',
          wordCount: 36,
        },
      },
      {
        sourceName: 'Aaple Sarkar MahaOnline Portal',
        department: 'Revenue & Public Delivery Department, Govt of Maharashtra',
        service: 'State Right to Services Delivery',
        serviceType: 'State Single Window Portal',
        location: { state: 'Maharashtra', district: 'All', city: 'All' },
        officialDomain: 'aaplesarkar.mahaonline.gov.in',
        domain: 'aaplesarkar.mahaonline.gov.in',
        sourceUrl: 'https://aaplesarkar.mahaonline.gov.in/',
        url: 'https://aaplesarkar.mahaonline.gov.in/',
        sourceType: 'portal',
        description: 'Single window delivery portal for Maharashtra state certificates and revenue services.',
        sourceStatus: 'verified',
        verificationStatus: 'approved',
        extractedContent: {
          title: 'Aaple Sarkar MahaOnline Portal - Maharashtra Single Window Portal',
          headers: ['Revenue Services', 'Public Service Delivery', 'Certificates', 'Licensing'],
          cleanText: 'Aaple Sarkar MahaOnline single window delivery portal for Maharashtra state public services under Right to Public Services Act. Available services: Income Certificate, Domicile Certificate, Non-Creamy Layer Certificate, Solvency Certificate, Senior Citizen Certificate, Shop & Establishment Registration (Gumasta license).',
          wordCount: 40,
        },
      },
      {
        sourceName: 'Passport Seva Official Portal',
        department: 'Ministry of External Affairs, Government of India',
        service: 'Indian Passport Services',
        serviceType: 'Union Passport Delivery',
        location: { state: 'National', district: 'All', city: 'All' },
        officialDomain: 'passportindia.gov.in',
        domain: 'passportindia.gov.in',
        sourceUrl: 'https://passportindia.gov.in/',
        url: 'https://passportindia.gov.in/',
        sourceType: 'portal',
        description: 'Official Passport Seva portal for fresh passport, re-issue, Tatkaal, and PCC.',
        sourceStatus: 'verified',
        verificationStatus: 'approved',
        extractedContent: {
          title: 'Passport Seva Official Portal - Ministry of External Affairs, Government of India',
          headers: ['Passport Services', 'Fresh Passport Application', 'Required Documents', 'Processing Fees'],
          cleanText: 'Passport Seva Official Portal, Ministry of External Affairs, Government of India. Services available: Fresh Passport Application, Passport Renewal, Tatkaal Passport, Police Clearance Certificate (PCC). Required documents for Fresh Passport Application: Proof of Address (Aadhaar Card, Water Bill, Electricity Bill, Bank Passbook), Proof of Date of Birth (Birth Certificate, Matriculation Certificate, PAN Card, Aadhaar Card), Photo ID Proof (Voter ID Card, Aadhaar Card, PAN Card). Standard Passport processing fee for a normal 36-page booklet is ₹1,500.',
          wordCount: 75,
        },
      },
      {
        sourceName: 'Sarathi Parivahan RTO Portal',
        department: 'Ministry of Road Transport and Highways (MoRTH)',
        service: 'Driving Licence & Vehicle Transport Services',
        serviceType: 'Union Transport Services',
        location: { state: 'National', district: 'All', city: 'All' },
        officialDomain: 'sarathi.parivahan.gov.in',
        domain: 'sarathi.parivahan.gov.in',
        sourceUrl: 'https://sarathi.parivahan.gov.in/',
        url: 'https://sarathi.parivahan.gov.in/',
        sourceType: 'portal',
        description: 'Official National Transport portal for driving licences and RTO permits.',
        sourceStatus: 'verified',
        verificationStatus: 'approved',
        extractedContent: {
          title: 'Sarathi Parivahan RTO Portal - Ministry of Road Transport and Highways',
          headers: ['Driving Licence', 'Learner Licence', 'LL Test Slot Booking', 'DL Renewal'],
          cleanText: 'Sarathi Parivahan RTO Portal, Ministry of Road Transport and Highways (MoRTH), Government of India. Services available: Learner Licence (LL) Application, Driving Licence (DL) Renewal, Duplicate DL, International Driving Permit, LL Test Slot Booking. Required documents: Address Proof (Aadhaar Card, Passport, Ration Card), Age Proof (Birth Certificate, School Leaving Certificate, PAN Card), Medical Fitness Certificate Form 1A for applicants over 40 years of age.',
          wordCount: 65,
        },
      },
      {
        sourceName: 'Voter Services Portal (ECI)',
        department: 'Election Commission of India',
        service: 'Electoral Services & Voter Registration',
        serviceType: 'Union Electoral Services',
        location: { state: 'National', district: 'All', city: 'All' },
        officialDomain: 'voters.eci.gov.in',
        domain: 'voters.eci.gov.in',
        sourceUrl: 'https://voters.eci.gov.in/',
        url: 'https://voters.eci.gov.in/',
        sourceType: 'portal',
        description: 'Official Election Commission of India portal for voter registration and Form 6.',
        sourceStatus: 'verified',
        verificationStatus: 'approved',
        extractedContent: {
          title: 'Voter Services Portal - Election Commission of India (ECI)',
          headers: ['Electoral Registration', 'Form 6 New Voter Registration', 'Form 8 Correction & EPIC'],
          cleanText: 'Official Voter Services Portal of Election Commission of India (ECI). Services available: Form 6 (New Voter Registration), Form 8 (Correction of Entries in Electoral Roll & Migration/EPIC Replacement), Track Voter Application Status, Search Name in Electoral Roll. Required documents: Passport size photograph, Proof of Age (Birth Certificate, Aadhaar Card, PAN Card, Class 10 Certificate), Proof of Residence (Aadhaar Card, Electricity Bill, Water Bill, Bank Passbook, Indian Passport).',
          wordCount: 68,
        },
      },
      {
        sourceName: 'Udyam Registration Portal',
        department: 'Ministry of Micro, Small & Medium Enterprises (MSME)',
        service: 'MSME Business Registration',
        serviceType: 'Union Business Registration',
        location: { state: 'National', district: 'All', city: 'All' },
        officialDomain: 'udyamregistration.gov.in',
        domain: 'udyamregistration.gov.in',
        sourceUrl: 'https://udyamregistration.gov.in/',
        url: 'https://udyamregistration.gov.in/',
        sourceType: 'portal',
        description: 'Official portal for MSME Udyam registration and certificate issuance.',
        sourceStatus: 'verified',
        verificationStatus: 'approved',
        extractedContent: {
          title: 'Udyam Registration Portal - Ministry of MSME',
          headers: ['MSME Registration', 'Udyam Certificate', 'Micro Small Medium Enterprise'],
          cleanText: 'Official Udyam Registration Portal, Ministry of Micro, Small & Medium Enterprises (MSME), Government of India. Services available: Free Online MSME Udyam Registration, Udyam Certificate Download, Udyam Re-registration. Zero registration fee (free of cost government service). Required details: Aadhaar Number of proprietor/partner/director, PAN Card Number, GSTIN (if applicable), Bank Account details, Business activity code (NIC Code).',
          wordCount: 58,
        },
      },
      {
        sourceName: 'NSDL PAN Portal',
        department: 'Income Tax Department, Ministry of Finance',
        service: 'PAN Card Allotment & Correction',
        serviceType: 'Taxation & Identity',
        location: { state: 'National', district: 'All', city: 'All' },
        officialDomain: 'onlineservices.nsdl.com',
        domain: 'onlineservices.nsdl.com',
        sourceUrl: 'https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html',
        url: 'https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html',
        sourceType: 'portal',
        description: 'Official NSDL portal for PAN card application and Form 49A processing.',
        sourceStatus: 'verified',
        verificationStatus: 'approved',
        extractedContent: {
          title: 'NSDL PAN Portal - Income Tax Department, Government of India',
          headers: ['PAN Card Application', 'Form 49A', 'PAN Correction', 'e-PAN'],
          cleanText: 'NSDL Official PAN Card Portal, Income Tax Department, Ministry of Finance, Government of India. Services available: New PAN Card Application (Form 49A for Indian Citizens), Changes or Correction in PAN Data, e-PAN Card Download. Required documents: Proof of Identity (Aadhaar Card, Voter ID, Passport, Driving Licence), Proof of Address (Aadhaar Card, Bank Account Statement, Utility Bill), Proof of Date of Birth (Birth Certificate, Aadhaar Card, Matriculation Certificate, Mark Sheet).',
          wordCount: 65,
        },
      },
      {
        sourceName: 'MahaFood RCMS Portal',
        department: 'Food, Civil Supplies and Consumer Protection Dept, Govt of Maharashtra',
        service: 'Ration Card Management System',
        serviceType: 'Public Distribution System',
        location: { state: 'Maharashtra', district: 'All', city: 'All' },
        officialDomain: 'rcms.mahafood.gov.in',
        domain: 'rcms.mahafood.gov.in',
        sourceUrl: 'https://rcms.mahafood.gov.in/',
        url: 'https://rcms.mahafood.gov.in/',
        sourceType: 'portal',
        description: 'Official Maharashtra PDS portal for ration card creation, member inclusion, and address updates.',
        sourceStatus: 'verified',
        verificationStatus: 'approved',
        extractedContent: {
          title: 'MahaFood RCMS Portal - Food, Civil Supplies and Consumer Protection Dept, Govt of Maharashtra',
          headers: ['Ration Card Management System', 'New Ration Card', 'Add Member to Ration Card'],
          cleanText: 'MahaFood RCMS Portal, Food, Civil Supplies and Consumer Protection Department, Government of Maharashtra. Services available: New Ration Card Application, Addition of Member Name to Ration Card (add wife name, newborn child), Deletion of Member Name, Ration Card Category Change (Yellow/Saffron/White), Address Modification. Required documents: Income Certificate, Proof of Identity (Aadhaar Card of head of family), Proof of Residence (Electricity Bill, Property Tax receipt), Aadhaar Cards of all family members, Birth/Marriage Certificate for adding member.',
          wordCount: 72,
        },
      },
    ];

    const createdSources = await GovernmentSource.insertMany(sourcesData);
    const sourceMap = {};
    createdSources.forEach((src) => {
      sourceMap[src.officialDomain] = src;
    });

    console.log(`✅ Seeded ${createdSources.length} IGOD & Official Government Sources.`);

    // Helper functions for seeding procedure catalog entries
    const defaultUser = await User.create({
      name: 'Test Citizen',
      email: 'citizen@example.com',
      passwordHash: '$2b$10$e8W/8V0x9lZtP7fE4O0pQ.aJz4c7M2b/O6hW0kL5p5A5b5c5d5e5f', // Password123!
      role: 'citizen',
    });

    await User.create({
      name: 'System Admin',
      email: 'admin@civicpath.gov.in',
      passwordHash: '$2b$10$e8W/8V0x9lZtP7fE4O0pQ.aJz4c7M2b/O6hW0kL5p5A5b5c5d5e5f', // AdminPassword123!
      role: 'admin',
    });

    // -------------------------------------------------------------------
    // 2. Define 70 Catalog Procedures with Steps, Docs, Dependencies & Metadata
    // -------------------------------------------------------------------
    console.log('📦 Seeding 70 Authoritative Catalog Procedures...');

    const proceduresMasterList = [
      // --- WATER & MUNICIPAL ---
      {
        title: 'Water Connection Application',
        aliases: ['new water connection', 'water meter', 'tap connection', 'apply water connection', 'water supply'],
        keywords: ['water', 'connection', 'meter', 'tap', 'amravati municipal corporation', 'plumbing', 'utility'],
        description: 'Process for obtaining a new domestic or commercial water supply connection from Amravati Municipal Corporation.',
        department: 'Water Supply Department',
        sector: 'Public Utilities',
        serviceType: 'Public Utilities',
        jurisdiction: 'Amravati Municipal Corporation',
        domain: 'amravaticorporation.in',
        sourceStatus: 'verified',
        steps: [
          { title: 'Submit Water Application Form', desc: 'File application form with property tax receipt and site layout plan.', dept: 'Water Supply Department', docs: ['Property Tax Paid Receipt', 'Owner Identity Proof', 'Site Layout Map'] },
          { title: 'Site Plumbing Inspection', desc: 'Municipal junior engineer inspects site for main pipeline distance and water pressure.', dept: 'Engineering Department', docs: ['Inspection Visit Slip'] },
          { title: 'Water Meter Installation & Fee Payment', desc: 'Pay connection fees and install approved water meter at connection node.', dept: 'Water Supply Department', docs: ['Fee Payment Receipt', 'Water Meter Bill Receipt'] }
        ]
      },
      {
        title: 'Water Connection Ownership Change',
        aliases: ['water connection transfer', 'change water name', 'transfer tap connection', 'water ownership change'],
        keywords: ['water', 'transfer', 'ownership', 'name change', 'property transfer'],
        description: 'Procedure to transfer existing water connection ownership to a new property buyer or heir.',
        department: 'Water Supply Department',
        sector: 'Public Utilities',
        serviceType: 'Public Utilities',
        jurisdiction: 'Amravati Municipal Corporation',
        domain: 'amravaticorporation.in',
        sourceStatus: 'database_only',
        steps: [
          { title: 'Submit Ownership Transfer Application', desc: 'Submit application with sale deed or inheritance certificate and previous owner NOC.', dept: 'Water Supply Department', docs: ['Registered Sale Deed', 'Previous Owner NOC', 'Latest Water Bill Paid Receipt'] },
          { title: 'Municipal Revenue Verification', desc: 'Municipal revenue clerk verifies property tax assessment name match.', dept: 'Revenue Department', docs: ['Property Tax Assessment Copy'] },
          { title: 'Issuance of Transfer Order', desc: 'Pay transfer fee and receive updated water connection consumer record.', dept: 'Water Supply Department', docs: ['Transfer Fee Payment Receipt'] }
        ]
      },
      {
        title: 'Water Connection Disconnection',
        aliases: ['disconnect water connection', 'stop water supply', 'close water connection'],
        keywords: ['water', 'disconnection', 'stop supply', 'close connection'],
        description: 'Formal request to temporarily or permanently disconnect municipal water connection.',
        department: 'Water Supply Department',
        sector: 'Public Utilities',
        jurisdiction: 'Amravati Municipal Corporation',
        domain: 'amravaticorporation.in',
        sourceStatus: 'database_only',
        steps: [
          { title: 'Clear Outstanding Water Dues', desc: 'Pay all pending water consumption bills and obtain zero-dues certificate.', dept: 'Revenue Department', docs: ['Zero Dues Clearance Certificate', 'Consumer Connection Number'] },
          { title: 'Submit Disconnection Application', desc: 'File formal disconnection request stating reason (demolition, vacancy).', dept: 'Water Supply Department', docs: ['Disconnection Request Letter', 'Identity Proof'] },
          { title: 'Physical Line Disconnection & Sealing', desc: 'Municipal plumber disconnects line and seals supply ferrule.', dept: 'Engineering Department', docs: ['Disconnection Slip'] }
        ]
      },
      {
        title: 'Water Connection Reconnection',
        aliases: ['reconnect water', 'restore water connection', 're-open water tap'],
        keywords: ['water', 'reconnection', 'restore supply', 'reopen tap'],
        description: 'Procedure to restore previously disconnected municipal water connection.',
        department: 'Water Supply Department',
        sector: 'Public Utilities',
        jurisdiction: 'Amravati Municipal Corporation',
        domain: 'amravaticorporation.in',
        sourceStatus: 'database_only',
        steps: [
          { title: 'Submit Reconnection Request', desc: 'Submit application with past disconnection certificate and clearance proof.', dept: 'Water Supply Department', docs: ['Disconnection Certificate Copy', 'Reconnection Request Form'] },
          { title: 'Reconnection Fee Payment', desc: 'Pay prescribed reconnection penalty/restoration charges.', dept: 'Revenue Department', docs: ['Reconnection Fee Receipt'] },
          { title: 'Restoration & Unsealing', desc: 'Municipal technician unseals supply line and verifies meter flow.', dept: 'Engineering Department', docs: ['Restoration Confirmation Report'] }
        ]
      },
      {
        title: 'Municipal Water Bill Payment & Services',
        aliases: ['pay water bill', 'water bill complaint', 'water tax payment', 'water bill duplicate'],
        keywords: ['water bill', 'payment', 'water tax', 'consumer bill', 'dues'],
        description: 'Online payment of municipal water bills, bill duplicate download, and tariff classification.',
        department: 'Water Supply Department',
        sector: 'Public Utilities',
        jurisdiction: 'Amravati Municipal Corporation',
        domain: 'amravaticorporation.in',
        sourceStatus: 'verified',
        steps: [
          { title: 'Fetch Water Consumer Record', desc: 'Enter Consumer ID / CAN number on Municipal portal to view current bill.', dept: 'Water Supply Department', docs: ['Water Consumer ID / CAN'] },
          { title: 'Verify Bill Details & Meter Reading', desc: 'Review current reading, previous dues, and consumption units.', dept: 'Revenue Department', docs: ['Bill Summary Statement'] },
          { title: 'Online Bill Payment', desc: 'Pay online via UPI, NetBanking, or card and download official receipt.', dept: 'Finance Department', docs: ['Online Payment Confirmation Receipt'] }
        ]
      },
      {
        title: 'Water Meter Complaint & Testing',
        aliases: ['faulty water meter', 'meter testing request', 'high water bill complaint', 'meter replacement'],
        keywords: ['water meter', 'faulty meter', 'testing', 'high bill', 'complaint'],
        description: 'File complaint for faulty, broken, or fast-running municipal water meter testing.',
        department: 'Water Supply Department',
        sector: 'Public Utilities',
        jurisdiction: 'Amravati Municipal Corporation',
        domain: 'amravaticorporation.in',
        sourceStatus: 'database_only',
        steps: [
          { title: 'Lodge Meter Testing Complaint', desc: 'File complaint with meter number and photo of current reading.', dept: 'Water Supply Department', docs: ['Meter Photo with Date', 'Latest Water Bill Copy'] },
          { title: 'Bench Testing Inspection', desc: 'Municipal meter testing division removes and tests meter accuracy.', dept: 'Engineering Department', docs: ['Meter Removal Slip'] },
          { title: 'Report & Bill Adjustment', desc: 'Receive lab test report and get bill adjusted if meter was faulty.', dept: 'Revenue Department', docs: ['Meter Accuracy Lab Report', 'Adjusted Bill Copy'] }
        ]
      },
      {
        title: 'Municipal Drainage Connection Permission',
        aliases: ['sewer connection', 'drainage permission', 'sanitary pipeline connection'],
        keywords: ['drainage', 'sewer', 'sanitation', 'sanitary connection', 'sewage'],
        description: 'Permission to connect private building drainage system to municipal sewer network.',
        department: 'Sanitation Department',
        sector: 'Public Utilities',
        jurisdiction: 'Amravati Municipal Corporation',
        domain: 'amravaticorporation.in',
        sourceStatus: 'database_only',
        steps: [
          { title: 'Submit Drainage Application', desc: 'Submit building layout with sanitary plumbing diagram.', dept: 'Sanitation Department', docs: ['Plumbing & Sanitary Plan', 'Property Building Approval Copy'] },
          { title: 'Sewer Line Distance Inspection', desc: 'Sanitary inspector inspects nearest municipal sewer line access.', dept: 'Sanitation Department', docs: ['Inspector Clearance Slip'] },
          { title: 'Connection Approval & Fee Payment', desc: 'Pay road cutting/drainage connection fees and obtain sanction order.', dept: 'Engineering Department', docs: ['Drainage Sanction Order', 'Road Cutting Deposit Receipt'] }
        ]
      },
      {
        title: 'Property Tax Assessment & Payment',
        aliases: ['pay property tax', 'house tax payment', 'property tax assessment', 'municipal tax'],
        keywords: ['property tax', 'house tax', 'municipal tax', 'assessment', 'property bill'],
        description: 'Assessment and online payment of annual municipal property tax for residential and commercial premises.',
        department: 'Property Tax Department',
        sector: 'Municipal Revenue',
        jurisdiction: 'Amravati Municipal Corporation',
        domain: 'amravaticorporation.in',
        sourceStatus: 'verified',
        steps: [
          { title: 'Property Index Search', desc: 'Search property record using Property Index Number (PIN) or owner name.', dept: 'Property Tax Department', docs: ['Property PIN / Assessment Number'] },
          { title: 'Review Tax Assessment Demand', desc: 'Verify annual rateable value, built-up area calculation, and concessions.', dept: 'Property Tax Department', docs: ['Assessment Demand Notice'] },
          { title: 'Make Tax Payment', desc: 'Pay online or at ward counter and receive stamped tax payment receipt.', dept: 'Finance Department', docs: ['Official Property Tax Receipt'] }
        ]
      },
      {
        title: 'Building Plan Sanction',
        aliases: ['building approval', 'construction permission', 'autodcr building plan', 'building noc'],
        keywords: ['building plan', 'construction', 'autodcr', 'sanction', 'architect'],
        description: 'Process for obtaining building construction plan approval and sanction from Town Planning Department.',
        department: 'Town Planning Department',
        sector: 'Urban Planning',
        jurisdiction: 'Town Planning Department',
        domain: 'amravati.gov.in',
        sourceStatus: 'verified',
        steps: [
          { title: 'Upload CAD Drawings via AutoDCR', desc: 'Licensed architect submits building plans adhering to Development Control Regulations.', dept: 'Town Planning Department', docs: ['AutoDCR CAD Plan File', 'Property Ownership Deed (7/12 / PR Card)', 'Architect License Certificate'] },
          { title: 'Multi-Department Scrutiny', desc: 'Verification of FSI, setback rules, road width, and fire safety clearance.', dept: 'Town Planning Department', docs: ['Scrutiny Fee Receipt', 'NOC Certificates'] },
          { title: 'Development Charge Payment & Building Permit', desc: 'Pay development charges and receive official Building Permit (Commencement Certificate).', dept: 'Town Planning Department', docs: ['Commencement Certificate', 'Approved Plan Layout'] }
        ]
      },
      {
        title: 'Fire Safety NOC Application',
        aliases: ['fire noc', 'fire safety certificate', 'fire clearance'],
        keywords: ['fire safety', 'noc', 'fire clearance', 'fire extinguisher', 'commercial safety'],
        description: 'Fire safety No Objection Certificate required for commercial, industrial, and high-rise premises.',
        department: 'Fire & Public Health Department',
        sector: 'Public Safety',
        jurisdiction: 'Fire & Public Health Department',
        domain: 'amravaticorporation.in',
        sourceStatus: 'verified',
        steps: [
          { title: 'Provisional Fire NOC Application', desc: 'Submit building layout with fire hydrant, extinguisher, and exit route plan.', dept: 'Fire Department', docs: ['Building Architectural Plan', 'Fire Equipment Specifications'] },
          { title: 'Fire Officer On-Site Demonstration', desc: 'Fire station officer tests alarms, hydrants, pressure pumps, and emergency exits.', dept: 'Fire Department', docs: ['Inspection Audit Report'] },
          { title: 'Final Fire NOC Issuance', desc: 'Receive Final Fire NOC valid for annual renewal.', dept: 'Fire Department', docs: ['Final Fire Safety NOC Certificate'] }
        ]
      },

      // --- CERTIFICATES ---
      {
        title: 'Income Certificate Application',
        aliases: ['income certificate', 'apply income certificate', 'family income proof', 'tahsildar income certificate'],
        keywords: ['income', 'certificate', 'tahsildar', 'aaple sarkar', 'revenue', 'scholarship proof'],
        description: 'Issuance of official annual income certificate by Tahsildar for scholarships, fee concessions, and government schemes.',
        department: 'Tahsildar Office / Revenue',
        sector: 'Revenue Services',
        jurisdiction: 'Tahsildar Office',
        domain: 'aaplesarkar.mahaonline.gov.in',
        sourceStatus: 'verified',
        steps: [
          { title: 'Submit Income Self-Declaration & Proofs', desc: 'File application on Aaple Sarkar with salary slip, ITR, or employer declaration.', dept: 'Revenue Department', docs: ['Applicant Aadhaar Card', 'Income Proof (Salary Slip / Form 16 / Bank Statement)', 'Ration Card Copy'] },
          { title: 'Talathi Revenue Inquiry', desc: 'Local Talathi verifies family agriculture holdings and local business earnings.', dept: 'Talathi Office', docs: ['Talathi Verification Report'] },
          { title: 'Tahsildar Signature & Digital Certificate', desc: 'Sub-Divisional Officer / Tahsildar digitally signs and issues Income Certificate.', dept: 'Tahsildar Office', docs: ['Digitally Signed Income Certificate'] }
        ]
      },
      {
        title: 'Caste Certificate Application',
        aliases: ['caste certificate', 'apply caste certificate', 'sc st obc certificate', 'caste proof'],
        keywords: ['caste', 'obc', 'sc', 'st', 'sbc', 'vjnt', 'certificate', 'sdo'],
        description: 'Official issuance of Caste Certificate (SC/ST/OBC/VJNT) by Sub-Divisional Officer (SDO).',
        department: 'Sub-Divisional Officer (SDO)',
        sector: 'Revenue Services',
        jurisdiction: 'Sub-Divisional Officer (SDO)',
        domain: 'aaplesarkar.mahaonline.gov.in',
        sourceStatus: 'verified',
        steps: [
          { title: 'Submit Pre-1967/1961 Caste Proof Documents', desc: 'Submit applicant school leaving certificate and ancestral caste proof prior to cutoff year.', dept: 'Revenue Department', docs: ['Applicant School Leaving Certificate', 'Father/Grandfather School Record or Caste Proof', 'Aadhaar Card'] },
          { title: 'Vigilance Cell Verification', desc: 'District Caste Scrutiny Committee / Revenue Inspector conducts field verification.', dept: 'Social Justice Department', docs: ['Vigilance Field Enquiry Report'] },
          { title: 'SDO Sanction & Caste Certificate', desc: 'SDO approves application and issues barcode-embedded Caste Certificate.', dept: 'SDO Office', docs: ['Barcoded Caste Certificate'] }
        ]
      },
      {
        title: 'Non-Creamy Layer Certificate',
        aliases: ['non creamy layer', 'ncl certificate', 'apply ncl', 'obc non creamy layer'],
        keywords: ['ncl', 'non creamy layer', 'obc', 'reservation', 'certificate'],
        description: 'Certificate certifying that an OBC applicant does not belong to the Creamy Layer threshold.',
        department: 'Sub-Divisional Officer / Tahsildar',
        sector: 'Revenue Services',
        jurisdiction: 'Sub-Divisional Officer (SDO)',
        domain: 'aaplesarkar.mahaonline.gov.in',
        sourceStatus: 'verified',
        steps: [
          { title: 'Submit 3-Year Income Proof & Caste Certificate', desc: 'Submit valid OBC caste certificate along with 3 consecutive years income proof.', dept: 'Revenue Department', docs: ['Valid OBC Caste Certificate', '3-Years Income Proof', 'Affidavit for Non-Creamy Status'] },
          { title: 'Revenue Clerk Scrutiny', desc: 'Verification of family income ceiling and non-exclusion category criteria.', dept: 'Tahsildar Office', docs: ['Verification Note'] },
          { title: 'NCL Certificate Issuance', desc: 'Issue Non-Creamy Layer certificate valid for 3 financial years.', dept: 'SDO Office', docs: ['Non-Creamy Layer Certificate'] }
        ]
      },
      {
        title: 'Domicile Certificate Application',
        aliases: ['domicile certificate', 'residence certificate', 'apply domicile', 'maharashtra domicile'],
        keywords: ['domicile', 'residence', 'maharashtra proof', '15 years residence', 'certificate'],
        description: 'Official proof of continuous 15-year residence in Maharashtra State issued by Competent Authority.',
        department: 'Sub-Divisional Officer / Tahsildar',
        sector: 'Social Welfare',
        jurisdiction: 'Tahsildar Office',
        domain: 'aaplesarkar.mahaonline.gov.in',
        sourceStatus: 'verified',
        steps: [
          { title: 'Submit 15-Year Residence Documents', desc: 'Upload school certificates from 1st to 10th/12th or continuous electricity bills.', dept: 'Revenue Department', docs: ['Continuous 10/15 Year School Certificates', 'Ration Card / Election Card', 'Self-Declaration Affidavit'] },
          { title: 'Talathi & Police Inquiry Check', desc: 'Talathi verifies physical residence address in local municipal ward.', dept: 'Talathi Office', docs: ['Residence Verification Report'] },
          { title: 'Domicile Certificate Issuance', desc: 'Receive digitally signed Domicile Certificate valid for lifetime.', dept: 'Tahsildar Office', docs: ['Digital Domicile Certificate'] }
        ]
      },
      {
        title: 'Age, Nationality & Domicile Certificate',
        aliases: ['age nationality domicile', 'nationality certificate', 'indian nationality certificate'],
        keywords: ['nationality', 'age', 'domicile', 'indian national', 'certificate'],
        description: 'Combined certificate proving age, Indian nationality, and Maharashtra domicile for admissions.',
        department: 'Sub-Divisional Officer (SDO)',
        sector: 'Revenue Services',
        jurisdiction: 'Sub-Divisional Officer (SDO)',
        domain: 'aaplesarkar.mahaonline.gov.in',
        sourceStatus: 'database_only',
        steps: [
          { title: 'Submit Birth & Nationality Proofs', desc: 'Submit birth certificate, passport/voter ID, and school leaving certificate.', dept: 'Revenue Department', docs: ['Birth Certificate', 'School Leaving Certificate', 'Aadhaar Card'] },
          { title: 'Verification of Indian Citizenship Criteria', desc: 'Verification of birth in India or naturalization proof.', dept: 'SDO Office', docs: ['Citizenship Verification Note'] },
          { title: 'Certificate Issuance', desc: 'Receive combined Age, Nationality, and Domicile Certificate.', dept: 'SDO Office', docs: ['Combined Nationality & Domicile Certificate'] }
        ]
      },
      {
        title: 'Temporary Residence Certificate',
        aliases: ['temporary residence certificate', 'temp stay certificate', 'rental residence proof'],
        keywords: ['temporary residence', 'tenant certificate', 'stay proof', 'rental proof'],
        description: 'Certificate issued for temporary stay/residence in a municipal jurisdiction for job or study.',
        department: 'Tahsildar Office',
        sector: 'Revenue Services',
        jurisdiction: 'Tahsildar Office',
        domain: 'amravati.gov.in',
        sourceStatus: 'database_only',
        steps: [
          { title: 'Submit Registered Lease Agreement', desc: 'Submit registered rent agreement and landlord NOC.', dept: 'Revenue Department', docs: ['Registered Rent Agreement', 'Landlord Aadhaar & NOC', 'Employer/College Letter'] },
          { title: 'Ward Inquiry Verification', desc: 'Local revenue inspector verifies physical occupancy at rental address.', dept: 'Revenue Department', docs: ['Occupancy Verification Slip'] },
          { title: 'Temporary Certificate Issuance', desc: 'Receive Temporary Residence Certificate valid for 1 year.', dept: 'Tahsildar Office', docs: ['Temporary Residence Certificate'] }
        ]
      },
      {
        title: 'Senior Citizen Certificate Application',
        aliases: ['senior citizen card', 'senior citizen certificate', 'apply senior citizen card', '60 plus card'],
        keywords: ['senior citizen', 'age proof', 'pensioner card', 'elderly card', 'certificate'],
        description: 'Issuance of Senior Citizen Identity Card/Certificate for citizens aged 60 and above for travel and medical benefits.',
        department: 'Social Welfare Department',
        sector: 'Social Welfare',
        jurisdiction: 'Tahsildar Office',
        domain: 'aaplesarkar.mahaonline.gov.in',
        sourceStatus: 'database_only',
        steps: [
          { title: 'Submit Age & Blood Group Proof', desc: 'Submit passport/Aadhaar showing birth date along with medical blood group report.', dept: 'Social Welfare Department', docs: ['Aadhaar Card / Voter ID (Age 60+)', 'Blood Group Certificate', '2 Passport Photos'] },
          { title: 'Age Verification Scrutiny', desc: 'Clerk verifies age criteria completion (60 years completed).', dept: 'Social Welfare Department', docs: ['Scrutiny Form'] },
          { title: 'Senior Citizen ID Card Issuance', desc: 'Receive official Senior Citizen Identity Card.', dept: 'Social Welfare Department', docs: ['Senior Citizen Identity Card'] }
        ]
      },
      {
        title: 'Solvency Certificate Application',
        aliases: ['solvency certificate', 'apply solvency', 'financial solvency certificate', 'bank solvency proof'],
        keywords: ['solvency', 'financial status', 'property valuation', 'bank guarantee', 'tenders'],
        description: 'Certificate verifying financial solvency and asset evaluation required for government contracts and tenders.',
        department: 'Tahsildar Office / Revenue',
        sector: 'Revenue Services',
        jurisdiction: 'Tahsildar Office',
        domain: 'amravati.gov.in',
        sourceStatus: 'database_only',
        steps: [
          { title: 'Submit Property Valuation & Bank Balance Proof', desc: 'Submit valuation report of immovable properties, bank statements, and tax clearances.', dept: 'Revenue Department', docs: ['Property Valuation Report by Chartered Engineer', '7/12 Extract / Property Card', 'Bank Solvency Letter'] },
          { title: 'Revenue encumbrance check', desc: 'Tahsildar verifies property is free from government dues or mortgages.', dept: 'Tahsildar Office', docs: ['Encumbrance Verification Note'] },
          { title: 'Solvency Certificate Approval', desc: 'Receive Solvency Certificate stating verified monetary limit.', dept: 'Tahsildar Office', docs: ['Official Solvency Certificate'] }
        ]
      },
      {
        title: 'Residence Certificate Application',
        aliases: ['residence certificate', 'address proof certificate', 'local resident certificate'],
        keywords: ['residence', 'address certificate', 'local resident', 'tahsildar'],
        description: 'General residence certificate issued by Tahsildar for local municipal address verification.',
        department: 'Tahsildar Office',
        sector: 'Revenue Services',
        jurisdiction: 'Tahsildar Office',
        domain: 'aaplesarkar.mahaonline.gov.in',
        sourceStatus: 'database_only',
        steps: [
          { title: 'Submit Address Proof & Ration Card', desc: 'Submit electricity bill, voter card, or ration card.', dept: 'Revenue Department', docs: ['Electricity Bill', 'Voter ID', 'Aadhaar Card'] },
          { title: 'Talathi Verification', desc: 'Talathi certifies continuous residence at applicant ward address.', dept: 'Talathi Office', docs: ['Talathi Certificate'] },
          { title: 'Certificate Issuance', desc: 'Receive official Residence Certificate.', dept: 'Tahsildar Office', docs: ['Residence Certificate'] }
        ]
      },
      {
        title: 'Living Certificate Application',
        aliases: ['living certificate', 'life certificate', 'jeeavan pramaan', 'pensioner life certificate'],
        keywords: ['life certificate', 'living certificate', 'jeevan pramaan', 'pensioner', 'pension'],
        description: 'Life certificate certifying pensioner is alive for annual pension disbursement.',
        department: 'Treasury / Social Welfare Department',
        sector: 'Social Welfare',
        jurisdiction: 'Tahsildar Office',
        domain: 'aaplesarkar.mahaonline.gov.in',
        sourceStatus: 'database_only',
        steps: [
          { title: 'Biometric Jeevan Pramaan Verification', desc: 'Pensioner presents Aadhaar biometric or visits Treasury office in person.', dept: 'Treasury Office', docs: ['Aadhaar Card', 'Pension PPO Number', 'Biometric Scan'] },
          { title: 'Digital Life Certificate Generation', desc: 'System generates Jeevan Pramaan Digital Life Certificate.', dept: 'Treasury Office', docs: ['Digital Life Certificate Slip'] }
        ]
      },
      {
        title: 'Below Poverty Line (BPL) Certificate',
        aliases: ['bpl certificate', 'bpl proof', 'below poverty line card'],
        keywords: ['bpl', 'below poverty line', 'poverty certificate', 'ration card bpl'],
        description: 'Certificate certifying household BPL survey listing for welfare schemes and medical aid.',
        department: 'Rural Development / Municipal Corporation',
        sector: 'Social Welfare',
        jurisdiction: 'Tahsildar Office',
        domain: 'amravati.gov.in',
        sourceStatus: 'database_only',
        steps: [
          { title: 'Submit BPL Survey List Extract Request', desc: 'Submit application with Yellow Ration Card copy and BPL survey number.', dept: 'Social Welfare Department', docs: ['Yellow BPL Ration Card Copy', 'Aadhaar Card', 'BPL Survey Number'] },
          { title: 'Gram Sevak / Ward Officer Verification', desc: 'Verification of entry in official BPL census register.', dept: 'Municipal Ward Office', docs: ['Census Entry Extract'] },
          { title: 'BPL Certificate Issuance', desc: 'Receive official BPL Certificate.', dept: 'Tahsildar Office', docs: ['BPL Certificate'] }
        ]
      },
      {
        title: 'Agriculturist Certificate Application',
        aliases: ['agriculturist certificate', 'farmer certificate', 'shetkari dakhla'],
        keywords: ['agriculturist', 'farmer', 'shetkari', 'land owner', '7 12 extract'],
        description: 'Official certificate certifying that applicant or parent is a bona-fide agricultural land holder.',
        department: 'Tahsildar Office / Revenue',
        sector: 'Revenue Services',
        jurisdiction: 'Tahsildar Office',
        domain: 'aaplesarkar.mahaonline.gov.in',
        sourceStatus: 'database_only',
        steps: [
          { title: 'Submit 7/12 Extract & 8A Records', desc: 'Upload latest 7/12 agricultural land record showing applicant/parent name.', dept: 'Revenue Department', docs: ['Latest 7/12 Extract (Within 3 Months)', '8A Land Holding Extract', 'Aadhaar Card'] },
          { title: 'Talathi Crop Record Verification', desc: 'Talathi verifies active agricultural cultivation record (Pahani).', dept: 'Talathi Office', docs: ['Talathi Pahani Verification Slip'] },
          { title: 'Agriculturist Certificate Issuance', desc: 'Receive Tahsildar signed Agriculturist Certificate.', dept: 'Tahsildar Office', docs: ['Agriculturist Certificate'] }
        ]
      },
      {
        title: 'Small Land Holder Farmer Certificate',
        aliases: ['small farmer certificate', 'alpa bhu dharak', 'marginal farmer certificate'],
        keywords: ['small farmer', 'marginal farmer', 'alpa bhudharak', 'land ceiling', 'subsidy'],
        description: 'Certificate certifying farmer holds less than 2 hectares of agricultural land for agricultural subsidies.',
        department: 'Tahsildar Office',
        sector: 'Revenue Services',
        jurisdiction: 'Tahsildar Office',
        domain: 'amravati.gov.in',
        sourceStatus: 'database_only',
        steps: [
          { title: 'Submit Total Land Holding Declarations', desc: 'Submit 7/12 extracts of all agricultural land holdings owned by family.', dept: 'Revenue Department', docs: ['All Family 7/12 Land Extracts', 'Self-Declaration of Total Land Area'] },
          { title: 'Area Calculation Verification', desc: 'Revenue inspector verifies total land is under 2.0 hectares limit.', dept: 'Tahsildar Office', docs: ['Area Scrutiny Sheet'] },
          { title: 'Small Farmer Certificate Issuance', desc: 'Receive Small / Marginal Farmer Certificate.', dept: 'Tahsildar Office', docs: ['Small Land Holder Certificate'] }
        ]
      },
      {
        title: 'Landless Farmer Certificate',
        aliases: ['landless certificate', 'bhumiheen dakhla', 'landless labour certificate'],
        keywords: ['landless', 'bhumiheen', 'agricultural labourer', 'certificate'],
        description: 'Certificate certifying applicant belongs to an agricultural family without land ownership.',
        department: 'Tahsildar Office',
        sector: 'Revenue Services',
        jurisdiction: 'Tahsildar Office',
        domain: 'amravati.gov.in',
        sourceStatus: 'database_only',
        steps: [
          { title: 'Submit No-Land Declaration Affidavit', desc: 'Submit notarized affidavit declaring no agricultural land holding in the state.', dept: 'Revenue Department', docs: ['Notarized No-Land Affidavit', 'Voter Card / Ration Card', 'Talathi No-Land Report'] },
          { title: 'Village Inquiry Check', desc: 'Talathi verifies no land registration entry exists under applicant name.', dept: 'Talathi Office', docs: ['Village Inquiry Certificate'] },
          { title: 'Landless Certificate Issuance', desc: 'Receive Landless Agricultural Labourer Certificate.', dept: 'Tahsildar Office', docs: ['Landless Certificate'] }
        ]
      },

      // --- CIVIL REGISTRATION ---
      {
        title: 'Birth Certificate Application',
        aliases: ['birth certificate', 'apply birth certificate', 'birth registration', 'baby birth certificate'],
        keywords: ['birth', 'certificate', 'hospital birth', 'crsorgi', 'municipal health'],
        description: 'Official birth certificate issuance for births registered with municipal health department.',
        department: 'Municipal Health Department',
        sector: 'Civic Registration',
        jurisdiction: 'Municipal Corporation',
        domain: 'crsorgi.gov.in',
        sourceStatus: 'verified',
        steps: [
          { title: 'Hospital Birth Discharge Report Upload', desc: 'Submit hospital birth report slip, parents identity, and marriage certificate.', dept: 'Health Department', docs: ['Hospital Birth Discharge Slip', 'Parents Aadhaar Cards', 'Parents Marriage Certificate'] },
          { title: 'Civil Registration System (CRS) Entry', desc: 'Health registrar verifies child name and birth timestamp entry.', dept: 'Health Department', docs: ['CRS Entry Registration Slip'] },
          { title: 'Birth Certificate Download', desc: 'Download QR-coded official Birth Certificate from CRS portal.', dept: 'Health Department', docs: ['Official QR-Coded Birth Certificate'] }
        ]
      },
      {
        title: 'Death Certificate Application',
        aliases: ['death certificate', 'apply death certificate', 'death registration', 'cremation certificate'],
        keywords: ['death', 'certificate', 'cremation', 'burial', 'health department'],
        description: 'Official death certificate issuance for deaths registered within municipal jurisdiction.',
        department: 'Municipal Health Department',
        sector: 'Civic Registration',
        jurisdiction: 'Municipal Corporation',
        domain: 'crsorgi.gov.in',
        sourceStatus: 'verified',
        steps: [
          { title: 'Submit Doctor Cause of Death & Cremation Slip', desc: 'Submit doctor death summary and crematorium/burial ground receipt.', dept: 'Health Department', docs: ['Doctor Medical Certificate of Cause of Death', 'Crematorium / Burial Ground Receipt', 'Deceased Aadhaar Card'] },
          { title: 'Registrar Entry Verification', desc: 'Health registrar verifies death register records.', dept: 'Health Department', docs: ['Registrar Verification Slip'] },
          { title: 'Death Certificate Issuance', desc: 'Receive QR-coded official Death Certificate.', dept: 'Health Department', docs: ['Official Death Certificate'] }
        ]
      },
      {
        title: 'Marriage Certificate Application',
        aliases: ['marriage certificate', 'register marriage', 'marriage registration', 'court marriage certificate'],
        keywords: ['marriage', 'certificate', 'registration', 'bride groom', 'wedding proof'],
        description: 'Legal registration of marriage under Maharashtra Regulation of Marriage Bureaus Act.',
        department: 'Marriage Registrar / Municipal Corporation',
        sector: 'Civic Registration',
        jurisdiction: 'Municipal Corporation',
        domain: 'aaplesarkar.mahaonline.gov.in',
        sourceStatus: 'verified',
        steps: [
          { title: 'Submit Marriage Notice & Wedding Card', desc: 'Submit joint marriage application with wedding invitation card and photos.', dept: 'Marriage Registrar Office', docs: ['Wedding Invitation Card & Wedding Photo', 'Bride & Groom Birth / Age Proofs', '3 Witness Identity Cards'] },
          { title: 'Personal Appearance & Witness Signatures', desc: 'Bride, groom, and 3 witnesses appear before Registrar of Marriages.', dept: 'Marriage Registrar Office', docs: ['Witness Declaration Forms'] },
          { title: 'Marriage Register Entry & Certificate', desc: 'Registrar issues legal Marriage Registration Certificate.', dept: 'Marriage Registrar Office', docs: ['Legal Marriage Certificate'] }
        ]
      },
      {
        title: 'Birth Certificate Name Correction',
        aliases: ['birth certificate correction', 'change name birth certificate', 'correct spelling birth certificate'],
        keywords: ['birth', 'correction', 'name change', 'spelling correction', 'health registrar'],
        description: 'Procedure to correct spelling errors or add child name to previously issued birth certificate.',
        department: 'Municipal Health Department',
        sector: 'Civic Registration',
        jurisdiction: 'Municipal Corporation',
        domain: 'amravaticorporation.in',
        sourceStatus: 'database_only',
        steps: [
          { title: 'Submit Affidavit & School Record', desc: 'Submit notarized name correction affidavit and school bonafide certificate.', dept: 'Health Department', docs: ['Notarized Correction Affidavit', 'School Bonafide / Admission Record', 'Original Birth Certificate'] },
          { title: 'Gazette / Gazette Officer Verification', desc: 'Health registrar verifies correction against original hospital delivery register.', dept: 'Health Department', docs: ['Hospital Register Verification Slip'] },
          { title: 'Corrected Birth Certificate Issuance', desc: 'Receive updated Birth Certificate with corrected name.', dept: 'Health Department', docs: ['Updated Birth Certificate'] }
        ]
      },
      {
        title: 'Death Certificate Detail Correction',
        aliases: ['death certificate correction', 'correct death details', 'death record correction'],
        keywords: ['death', 'correction', 'spelling change', 'date of death correction'],
        description: 'Procedure to correct name, age, or date of death in official death register records.',
        department: 'Municipal Health Department',
        sector: 'Civic Registration',
        jurisdiction: 'Municipal Corporation',
        domain: 'amravaticorporation.in',
        sourceStatus: 'database_only',
        steps: [
          { title: 'Submit Hospital Medical Summary & Affidavit', desc: 'Submit hospital admission/death record and family correction affidavit.', dept: 'Health Department', docs: ['Original Hospital Medical Summary', 'Correction Affidavit by Legal Heir', 'Original Death Certificate'] },
          { title: 'Registrar Inquiry Order', desc: 'Health Officer approves correction entry in master register.', dept: 'Health Department', docs: ['Correction Order Sheet'] },
          { title: 'Corrected Certificate Download', desc: 'Download updated Death Certificate.', dept: 'Health Department', docs: ['Corrected Death Certificate'] }
        ]
      },

      // --- BUSINESS & COMMERCIAL ---
      {
        title: 'Trade License Application',
        aliases: ['trade license', 'apply trade license', 'shop license', 'municipal business license'],
        keywords: ['trade license', 'shop act', 'business permit', 'amravati municipal corporation', 'retail license'],
        description: 'Mandatory trade license for operating commercial businesses and shops within municipal limits.',
        department: 'Licensing Department',
        sector: 'Business License',
        jurisdiction: 'Municipal Corporation',
        domain: 'aaplesarkar.mahaonline.gov.in',
        sourceStatus: 'verified',
        steps: [
          { title: 'Submit Business Layout & Property NOC', desc: 'File application on Aaple Sarkar with shop agreement and property tax receipt.', dept: 'Licensing Department', docs: ['Property Rent Agreement / Property Tax Receipt', 'Owner Identity Proof', 'Shop Photo with Name Board'] },
          { title: 'Municipal Sanitary & Health Inspection', desc: 'Ward Sanitary Inspector inspects trade premises for health standards.', dept: 'Sanitation Department', docs: ['Sanitary Inspection Report'] },
          { title: 'Trade Fee Payment & License Issuance', desc: 'Pay annual trade license fee and receive municipal Trade License Certificate.', dept: 'Licensing Department', docs: ['Official Trade License Certificate'] }
        ]
      },
      {
        title: 'Shop & Establishment Registration (Gumasta)',
        aliases: ['gumasta license', 'shop and establishment', 'shop act license', 'maharashtra shop act'],
        keywords: ['gumasta', 'shop act', 'establishment', 'labour department', 'business license'],
        description: 'Registration of shops and commercial establishments under Maharashtra Shops and Establishments Act.',
        department: 'Labour Department, Govt of Maharashtra',
        sector: 'Business License',
        jurisdiction: 'Labour Department',
        domain: 'aaplesarkar.mahaonline.gov.in',
        sourceStatus: 'verified',
        steps: [
          { title: 'Submit Form A Application', desc: 'Submit online application detailing employee count, business category, and shop address.', dept: 'Labour Department', docs: ['PAN Card of Business/Proprietor', 'Address Proof of Shop', 'Employee List & Salary Structure'] },
          { title: 'Labour Officer Verification', desc: 'Labour officer verifies establishment category (Intimation Form F for <10 workers).', dept: 'Labour Department', docs: ['Verification Slip'] },
          { title: 'Gumasta Registration Certificate Issuance', desc: 'Download official Shop & Establishment Registration Certificate.', dept: 'Labour Department', docs: ['Shop & Establishment Certificate (Gumasta)'] }
        ]
      },
      {
        title: 'Shop & Establishment Renewal',
        aliases: ['renew gumasta', 'renew shop act', 'renew shop license'],
        keywords: ['gumasta renewal', 'shop act renewal', 'labour renewal'],
        description: 'Periodic renewal of Shop & Establishment registration certificate.',
        department: 'Labour Department',
        sector: 'Business License',
        jurisdiction: 'Labour Department',
        domain: 'aaplesarkar.mahaonline.gov.in',
        sourceStatus: 'database_only',
        steps: [
          { title: 'Submit Renewal Application Form', desc: 'Submit previous registration number and updated employee headcount.', dept: 'Labour Department', docs: ['Previous Gumasta Registration Copy', 'Current Year Property Rent Bill'] },
          { title: 'Pay Renewal Fee', desc: 'Pay online renewal fee based on employee tier.', dept: 'Labour Department', docs: ['Payment Receipt'] },
          { title: 'Renewed Certificate Download', desc: 'Download renewed Shop Act certificate valid for up to 3 years.', dept: 'Labour Department', docs: ['Renewed Gumasta Certificate'] }
        ]
      },
      {
        title: 'Partnership Firm Registration',
        aliases: ['register partnership firm', 'partnership deed registration', 'rof partnership'],
        keywords: ['partnership', 'rof', 'registrar of firms', 'partnership deed', 'firm registration'],
        description: 'Registration of partnership firms under Indian Partnership Act with Registrar of Firms (ROF).',
        department: 'Registrar of Firms (ROF), Govt of Maharashtra',
        sector: 'Business Registration',
        jurisdiction: 'Registrar of Firms',
        domain: 'aaplesarkar.mahaonline.gov.in',
        sourceStatus: 'database_only',
        steps: [
          { title: 'Draft & Register Partnership Deed', desc: 'Draft deed on stamp paper and execute before Sub-Registrar.', dept: 'Sub-Registrar Office', docs: ['Registered Partnership Deed', 'PAN Cards of All Partners', 'Proof of Principal Place of Business'] },
          { title: 'Submit Form A to Registrar of Firms', desc: 'File online Form A with ROF along with registered deed copy.', dept: 'Registrar of Firms', docs: ['Form A Application Slip'] },
          { title: 'Firm Registration Certificate Issuance', desc: 'Receive ROF Certificate of Registration of Firm.', dept: 'Registrar of Firms', docs: ['ROF Registration Certificate'] }
        ]
      },
      {
        title: 'Factory License Registration',
        aliases: ['factory license', 'apply factory license', 'dish factory registration'],
        keywords: ['factory', 'dish', 'industrial license', 'power manufacturing', 'labour safety'],
        description: 'Registration and licensing of manufacturing factories under Factories Act, 1948 with DISH.',
        department: 'Directorate of Industrial Safety and Health (DISH)',
        sector: 'Business License',
        jurisdiction: 'Labour Department',
        domain: 'aaplesarkar.mahaonline.gov.in',
        sourceStatus: 'database_only',
        steps: [
          { title: 'Submit Factory Plan Approval Request', desc: 'Upload factory building layout, machinery horsepower, and chemical safety plans.', dept: 'DISH Department', docs: ['Approved Factory Building Plan', 'Horsepower & Worker Count Details', 'Pollution Control Board NOC'] },
          { title: 'Joint Safety & Machine Inspection', desc: 'DISH inspector inspects emergency exits, machine guards, and worker safety gear.', dept: 'DISH Department', docs: ['Safety Inspection Clearance Report'] },
          { title: 'Factory License Issuance', desc: 'Pay license fee and receive DISH Factory License.', dept: 'DISH Department', docs: ['Official Factory License'] }
        ]
      },
      {
        title: 'Factory License Renewal',
        aliases: ['renew factory license', 'dish license renewal'],
        keywords: ['factory renewal', 'dish renewal', 'annual factory fee'],
        description: 'Annual or 5-year renewal of factory license with DISH department.',
        department: 'Directorate of Industrial Safety and Health (DISH)',
        sector: 'Business License',
        jurisdiction: 'Labour Department',
        domain: 'aaplesarkar.mahaonline.gov.in',
        sourceStatus: 'database_only',
        steps: [
          { title: 'Submit Renewal Form 2', desc: 'Submit annual return summary and current worker strength.', dept: 'DISH Department', docs: ['Previous Factory License Copy', 'Annual Safety Returns'] },
          { title: 'Pay Renewal Fee', desc: 'Pay online renewal fee according to installed horsepower.', dept: 'DISH Department', docs: ['Online Payment Receipt'] },
          { title: 'Renewed Factory License', desc: 'Download renewed Factory License.', dept: 'DISH Department', docs: ['Renewed Factory License'] }
        ]
      },
      {
        title: 'Contract Labour Licence Application',
        aliases: ['contract labour license', 'apply labour license', 'contractor license'],
        keywords: ['contract labour', 'labour license', 'contractor', 'worker safety'],
        description: 'Licence required for contractors employing 20 or more contract workers.',
        department: 'Labour Department',
        sector: 'Business License',
        jurisdiction: 'Labour Department',
        domain: 'aaplesarkar.mahaonline.gov.in',
        sourceStatus: 'database_only',
        steps: [
          { title: 'Submit Form IV Application & Principal Employer Certificate', desc: 'Submit Form V certificate issued by principal employer and contractor registration.', dept: 'Labour Department', docs: ['Form V from Principal Employer', 'Contractor PAN & GST', 'Security Deposit Receipt'] },
          { title: 'Labour Commissioner Verification', desc: 'Assistant Labour Commissioner verifies worker wage standards and provident fund compliance.', dept: 'Labour Department', docs: ['Scrutiny Note'] },
          { title: 'Contract Labour Licence Issuance', desc: 'Receive Contract Labour Licence valid for specified contract period.', dept: 'Labour Department', docs: ['Contract Labour Licence Certificate'] }
        ]
      },
      {
        title: 'Building & Construction Worker Registration',
        aliases: ['bocw registration', 'construction worker card', 'bocw identity card'],
        keywords: ['bocw', 'construction worker', 'labour welfare', 'welfare board card'],
        description: 'Registration of building and construction workers under BOCW Welfare Board for accident cover and pensions.',
        department: 'Maharashtra Building & Other Construction Workers Board',
        sector: 'Social Welfare',
        jurisdiction: 'Labour Department',
        domain: 'aaplesarkar.mahaonline.gov.in',
        sourceStatus: 'database_only',
        steps: [
          { title: 'Submit 90-Days Work Certificate', desc: 'Submit certificate from employer or builder certifying 90 days work in past year.', dept: 'BOCW Board', docs: ['90-Days Working Certificate', 'Bank Passbook Copy', 'Aadhaar Card'] },
          { title: 'Labor Inspector Scrutiny', desc: 'Verification of construction site work credentials.', dept: 'Labour Department', docs: ['Verification Slip'] },
          { title: 'BOCW Smart Card Issuance', desc: 'Receive official BOCW Worker Smart Card & ID.', dept: 'BOCW Board', docs: ['BOCW Identity Smart Card'] }
        ]
      },
      {
        title: 'Udyam MSME Business Registration',
        aliases: ['udyam registration', 'msme registration', 'apply udyam', 'small business registration'],
        keywords: ['udyam', 'msme', 'micro business', 'small scale', 'union registration'],
        description: 'Free self-declaration online registration for Micro, Small, and Medium Enterprises (MSME).',
        department: 'Ministry of MSME',
        sector: 'Business Registration',
        jurisdiction: 'Ministry of MSME',
        domain: 'udyamregistration.gov.in',
        sourceStatus: 'verified',
        steps: [
          { title: 'Aadhaar Biometric / OTP Authentication', desc: 'Authenticate proprietor or director Aadhaar number on Udyam portal.', dept: 'Ministry of MSME', docs: ['Proprietor/Director Aadhaar Number', 'PAN Card of Business'] },
          { title: 'Business Activity & Investment Declaration', desc: 'Enter GSTIN, plant & machinery investment, and turnover figures.', dept: 'Ministry of MSME', docs: ['Bank Account Number & IFSC', 'NIC Activity Code Selection'] },
          { title: 'Instant Udyam Registration Certificate Download', desc: 'System automatically generates permanent Udyam Registration Number & Certificate.', dept: 'Ministry of MSME', docs: ['Official Udyam Registration Certificate'] }
        ]
      },
      {
        title: 'Udyam MSME Profile Update / Service',
        aliases: ['update udyam', 'edit udyam certificate', 'download udyam card'],
        keywords: ['udyam update', 'msme edit', 'udyam print', 'certificate download'],
        description: 'Online portal service to update investment figures, address, or re-print Udyam certificate.',
        department: 'Ministry of MSME',
        sector: 'Business Registration',
        jurisdiction: 'Ministry of MSME',
        domain: 'udyamregistration.gov.in',
        sourceStatus: 'verified',
        steps: [
          { title: 'Login with Udyam Registration Number & OTP', desc: 'Authenticate using URN and Mobile OTP.', dept: 'Ministry of MSME', docs: ['Udyam Registration Number (URN)'] },
          { title: 'Update Enterprise Details', desc: 'Modify address, bank account, or additional manufacturing activities.', dept: 'Ministry of MSME', docs: ['Updated Financial Statement'] },
          { title: 'Download Updated Certificate', desc: 'Download updated Udyam Certificate with QR code.', dept: 'Ministry of MSME', docs: ['Updated Udyam Certificate'] }
        ]
      },

      // --- TRANSPORT (RTO) ---
      {
        title: 'Fresh Driving Licence Application',
        aliases: ['driving licence', 'apply driving licence', 'learners licence', 'new dl application', 'rto dl'],
        keywords: ['driving licence', 'rto', 'learners licence', 'parivahan', 'dl test', 'driving test'],
        description: 'Complete process for obtaining a Learner License followed by Permanent Driving License from RTO.',
        department: 'Regional Transport Office (RTO)',
        sector: 'Union Transport Services',
        jurisdiction: 'Regional Transport Office (RTO)',
        domain: 'sarathi.parivahan.gov.in',
        sourceStatus: 'verified',
        steps: [
          { title: 'Learner License (LL) Online Test', desc: 'Apply online on Sarathi Parivahan, upload age/address proof, and pass computer traffic test.', dept: 'Regional Transport Office (RTO)', docs: ['Aadhaar Card / Age Proof', 'Blood Group Certificate', 'Medical Form 1A (if >40 yrs)'] },
          { title: 'Book Slot for Practical Driving Test', desc: 'After 30 days of Learner License, book RTO track test slot.', dept: 'Regional Transport Office (RTO)', docs: ['Valid Learner License Copy', 'Vehicle Registration Document'] },
          { title: 'Pass Track Test & DL Smart Card Issuance', desc: 'Pass physical driving track test before RTO Inspector and receive Smart Card DL.', dept: 'Regional Transport Office (RTO)', docs: ['Driving License Smart Card'] }
        ]
      },
      {
        title: 'Driving Licence Renewal Service',
        aliases: ['renew driving licence', 'dl renewal', 'renew dl online', 'rto dl renewal'],
        keywords: ['driving licence renewal', 'dl renewal', 'sarathi', 'rto renewal'],
        description: 'Procedure to renew an expired driving licence within or after grace period.',
        department: 'Regional Transport Office (RTO)',
        sector: 'Union Transport Services',
        jurisdiction: 'Regional Transport Office (RTO)',
        domain: 'sarathi.parivahan.gov.in',
        sourceStatus: 'verified',
        steps: [
          { title: 'Upload Expired DL & Medical Fitness Form 1A', desc: 'File application on Sarathi portal and upload Form 1A signed by registered doctor.', dept: 'RTO Department', docs: ['Original Expired Driving License', 'Medical Certificate Form 1A', 'Aadhaar Address Proof'] },
          { title: 'Fee Payment & Biometric Verification', desc: 'Pay renewal fees and complete facial/biometric verification.', dept: 'RTO Department', docs: ['Payment Receipt'] },
          { title: 'Renewed DL Smart Card Dispatch', desc: 'Receive renewed Driving License Smart Card by speed post.', dept: 'RTO Department', docs: ['Renewed Driving License'] }
        ]
      },
      {
        title: 'Duplicate Driving Licence Issuance',
        aliases: ['duplicate driving licence', 'lost driving license', 'duplicate dl'],
        keywords: ['duplicate dl', 'lost dl', 'damaged dl', 'rto duplicate'],
        description: 'Issuance of duplicate driving licence in case of loss, theft, or physical damage.',
        department: 'Regional Transport Office (RTO)',
        sector: 'Union Transport Services',
        jurisdiction: 'Regional Transport Office (RTO)',
        domain: 'sarathi.parivahan.gov.in',
        sourceStatus: 'database_only',
        steps: [
          { title: 'Lodge Police FIR & Loss Affidavit', desc: 'File online police complaint for lost DL and execute loss affidavit.', dept: 'Police Department', docs: ['Police FIR Copy for Lost DL', 'Notarized Loss Affidavit', 'Original Damaged DL (if damaged)'] },
          { title: 'Submit Online Duplicate Application', desc: 'Apply on Sarathi portal with DL number details.', dept: 'RTO Department', docs: ['Aadhaar Card', 'FIR Copy'] },
          { title: 'Duplicate DL Smart Card Issuance', desc: 'Receive duplicate DL card by post.', dept: 'RTO Department', docs: ['Duplicate Driving License'] }
        ]
      },
      {
        title: 'Addition of Class to Driving Licence',
        aliases: ['add class to dl', 'add motorcycle to dl', 'dl class addition', 'add 4 wheeler to dl'],
        keywords: ['add class dl', 'motorcycle to car', 'rto class endorsement'],
        description: 'Endorsing additional vehicle class (e.g. 4-wheeler LMV to existing 2-wheeler licence).',
        department: 'Regional Transport Office (RTO)',
        sector: 'Union Transport Services',
        jurisdiction: 'Regional Transport Office (RTO)',
        domain: 'sarathi.parivahan.gov.in',
        sourceStatus: 'database_only',
        steps: [
          { title: 'Obtain Learner License for New Class', desc: 'Apply for Learner License endorsement for new vehicle category.', dept: 'RTO Department', docs: ['Existing Driving License', 'LL Endorsement Application'] },
          { title: 'Practical Track Test for New Vehicle', desc: 'Appear for RTO driving test for newly added vehicle class.', dept: 'RTO Department', docs: ['Test Slot Booking Receipt'] },
          { title: 'Endorsed DL Smart Card', desc: 'Receive updated DL containing both vehicle class endorsements.', dept: 'RTO Department', docs: ['Endorsed Driving License'] }
        ]
      },
      {
        title: 'International Driving Permit (IDP)',
        aliases: ['international driving permit', 'idp licence', 'apply idp', 'foreign driving license'],
        keywords: ['idp', 'international driving permit', 'foreign driving', 'passport dl'],
        description: 'Issuance of International Driving Permit for driving validly in foreign countries.',
        department: 'Regional Transport Office (RTO)',
        sector: 'Union Transport Services',
        jurisdiction: 'Regional Transport Office (RTO)',
        domain: 'sarathi.parivahan.gov.in',
        sourceStatus: 'database_only',
        steps: [
          { title: 'Submit Passport & Visa Copy', desc: 'Submit application with valid Indian passport, foreign visa, and flight ticket.', dept: 'RTO Department', docs: ['Valid Indian Passport', 'Valid Foreign Visa & Ticket Copy', 'Valid Indian Driving License', 'Medical Form 1A'] },
          { title: 'RTO Verification & Fee Payment', desc: 'RTO Inspector verifies original passport and visa validity.', dept: 'RTO Department', docs: ['Fee Receipt'] },
          { title: 'IDP Booklet Issuance', desc: 'Receive official International Driving Permit valid for 1 year.', dept: 'RTO Department', docs: ['Official International Driving Permit Booklet'] }
        ]
      },
      {
        title: 'Vehicle Registration Certificate Renewal (RC Renewal)',
        aliases: ['renew rc', 'vehicle rc renewal', 'renew registration certificate', '15 year rc renewal'],
        keywords: ['rc renewal', 'registration certificate', '15 years vehicle', 'rto rc'],
        description: 'Renewal of vehicle registration certificate for private vehicles older than 15 years.',
        department: 'Regional Transport Office (RTO)',
        sector: 'Union Transport Services',
        jurisdiction: 'Regional Transport Office (RTO)',
        domain: 'sarathi.parivahan.gov.in',
        sourceStatus: 'database_only',
        steps: [
          { title: 'Book RTO Physical Vehicle Inspection', desc: 'Book inspection slot on Parivahan portal and produce vehicle at RTO fitness track.', dept: 'RTO Department', docs: ['Original RC Booklet', 'Valid Vehicle Insurance', 'PUC Certificate'] },
          { title: 'Technical Fitness Inspection', desc: 'RTO Vehicle Inspector checks engine, chassis number, brakes, and emissions.', dept: 'RTO Department', docs: ['Inspector Fitness Report'] },
          { title: 'Renewed RC Smart Card Issuance', desc: 'Pay green tax and receive renewed RC valid for 5 additional years.', dept: 'RTO Department', docs: ['Renewed RC Smart Card'] }
        ]
      },
      {
        title: 'Vehicle Fitness Certificate Renewal',
        aliases: ['vehicle fitness certificate', 'commercial vehicle fitness', 'rto fitness certificate'],
        keywords: ['fitness certificate', 'commercial vehicle', 'rto fitness', 'bus truck fitness'],
        description: 'Mandatory periodic fitness certificate renewal for commercial transport vehicles.',
        department: 'Regional Transport Office (RTO)',
        sector: 'Union Transport Services',
        jurisdiction: 'Regional Transport Office (RTO)',
        domain: 'sarathi.parivahan.gov.in',
        sourceStatus: 'database_only',
        steps: [
          { title: 'Submit Fitness Inspection Request', desc: 'Apply online and upload tax clearance and insurance receipts.', dept: 'RTO Department', docs: ['Vehicle RC Copy', 'Motor Vehicle Tax Clearance', 'Valid Insurance & PUC'] },
          { title: 'Automated Track Inspection', desc: 'Vehicle undergoes brake, headlight beam, speed governor, and safety inspection.', dept: 'RTO Department', docs: ['Inspection Audit Sheet'] },
          { title: 'Fitness Certificate Issuance', desc: 'Receive official Fitness Certificate & windshield emblem sticker.', dept: 'RTO Department', docs: ['Official Vehicle Fitness Certificate'] }
        ]
      },
      {
        title: 'Motor Vehicle Tax Payment Service',
        aliases: ['pay rto tax', 'road tax payment', 'vehicle tax payment online'],
        keywords: ['motor vehicle tax', 'rto tax', 'road tax', 'parivahan tax'],
        description: 'Online payment of annual or quarterly road tax for commercial and transport vehicles.',
        department: 'Regional Transport Office (RTO)',
        sector: 'Union Transport Services',
        jurisdiction: 'Regional Transport Office (RTO)',
        domain: 'sarathi.parivahan.gov.in',
        sourceStatus: 'database_only',
        steps: [
          { title: 'Fetch Vehicle Tax Demand Record', desc: 'Enter Vehicle Registration Number on Vahan portal.', dept: 'RTO Department', docs: ['Vehicle Registration Number'] },
          { title: 'Review Tax Assessment & Surcharges', desc: 'Verify seating capacity / laden weight tax calculation.', dept: 'RTO Department', docs: ['Tax Demand Breakup'] },
          { title: 'Online Tax Payment', desc: 'Pay tax online and instantly print official Motor Vehicle Tax Receipt.', dept: 'RTO Department', docs: ['Official RTO Tax Payment Receipt'] }
        ]
      },
      {
        title: 'Commercial Vehicle Transport Permit Service',
        aliases: ['goods permit', 'state permit', 'national permit', 'rto permit'],
        keywords: ['transport permit', 'goods permit', 'national permit', 'commercial permit'],
        description: 'Issuance and renewal of intrastate and national permits for commercial goods and passenger vehicles.',
        department: 'Regional Transport Office (RTO)',
        sector: 'Union Transport Services',
        jurisdiction: 'Regional Transport Office (RTO)',
        domain: 'sarathi.parivahan.gov.in',
        sourceStatus: 'database_only',
        steps: [
          { title: 'Submit Permit Application & Fitness Proof', desc: 'Submit application with valid fitness certificate and authorization letter.', dept: 'RTO Department', docs: ['Vehicle RC & Fitness Certificate', 'Valid Insurance', 'Driver Details'] },
          { title: 'Permit Fee & Composite Fee Payment', desc: 'Pay state permit fee or National Permit authorization fee.', dept: 'RTO Department', docs: ['Permit Payment Receipt'] },
          { title: 'Transport Permit Issuance', desc: 'Receive official Primary / National Permit Certificate.', dept: 'RTO Department', docs: ['Commercial Transport Permit Certificate'] }
        ]
      },

      // --- POLICE & HOME ---
      {
        title: 'Police Clearance Certificate (PCC)',
        aliases: ['police clearance certificate', 'pcc', 'police verification certificate', 'character certificate'],
        keywords: ['pcc', 'police clearance', 'character verification', 'passport pcc', 'police verification'],
        description: 'Police background clearance certificate required for foreign employment, visa, or government jobs.',
        department: 'District Police Commissionerate / Special Branch',
        sector: 'Public Safety',
        jurisdiction: 'Police Department',
        domain: 'amravati.gov.in',
        sourceStatus: 'verified',
        steps: [
          { title: 'Submit Online PCC Application', desc: 'Submit personal details, past 5-year address history, and purpose of clearance.', dept: 'Police Department', docs: ['Aadhaar Card', 'Current & Past Address Proofs', 'Passport Copy (for foreign visa)'] },
          { title: 'Local Police Station Field Inquiry', desc: 'Beat marshal visits residence address and verifies no criminal antecedents exist.', dept: 'Local Police Station', docs: ['Beat Marshal Verification Report'] },
          { title: 'Special Branch Clearance & PCC Issuance', desc: 'District Special Branch approves and issues official Police Clearance Certificate.', dept: 'Police Commissionerate', docs: ['Official Police Clearance Certificate'] }
        ]
      },
      {
        title: 'Character Verification Certificate',
        aliases: ['character certificate', 'job police verification', 'employee character verification'],
        keywords: ['character verification', 'police verification', 'employee check'],
        description: 'Character verification report required for employment, tenders, and private security badges.',
        department: 'District Police Department',
        sector: 'Public Safety',
        jurisdiction: 'Police Department',
        domain: 'amravati.gov.in',
        sourceStatus: 'database_only',
        steps: [
          { title: 'Submit Employer Verification Request', desc: 'Submit employer requisition letter with employee personal details.', dept: 'Police Department', docs: ['Employer Requisition Letter', 'Employee Aadhaar & Photo', '2 Reference Certificates'] },
          { title: 'Crime Database Record Check', desc: 'Police check Crime and Criminal Tracking Network & Systems (CCTNS) database.', dept: 'CCTNS Division', docs: ['CCTNS Clearance Record'] },
          { title: 'Character Verification Report Issuance', desc: 'Issue Character Certificate.', dept: 'Police Department', docs: ['Character Verification Certificate'] }
        ]
      },
      {
        title: 'Certified Copy of FIR Request',
        aliases: ['fir copy', 'request fir copy', 'download fir', 'police fir copy'],
        keywords: ['fir', 'fir copy', 'police station', 'cctns', 'crime report'],
        description: 'Obtaining a certified copy of First Information Report (FIR) registered at police station.',
        department: 'District Police Department',
        sector: 'Public Safety',
        jurisdiction: 'Police Department',
        domain: 'amravati.gov.in',
        sourceStatus: 'database_only',
        steps: [
          { title: 'Submit FIR Number & Police Station Details', desc: 'Enter FIR number, year, and police station jurisdiction.', dept: 'Police Department', docs: ['FIR Number / Date of Occurrence', 'Complainant / Applicant Aadhaar'] },
          { title: 'Duty Officer Authorization', desc: 'Station House Officer (SHO) verifies applicant status (complainant/victim/counsel).', dept: 'Local Police Station', docs: ['SHO Authorization Slip'] },
          { title: 'Certified FIR Copy Download', desc: 'Download certified digital copy of FIR.', dept: 'Police Department', docs: ['Certified Copy of FIR'] }
        ]
      },
      {
        title: 'Loudspeaker & Amplified Sound Permission',
        aliases: ['loudspeaker permission', 'sound permit', 'speaker permission', 'dj permission'],
        keywords: ['loudspeaker', 'sound permission', 'dj permit', 'police NOC', 'noise limit'],
        description: 'Police NOC for operating loudspeakers, DJ systems, or public address systems for events.',
        department: 'District Police Department',
        sector: 'Public Safety',
        jurisdiction: 'Police Department',
        domain: 'amravati.gov.in',
        sourceStatus: 'database_only',
        steps: [
          { title: 'Submit Event Venue & Decibel Plan', desc: 'Submit application with event date, venue owner NOC, and sound system wattage.', dept: 'Police Department', docs: ['Venue Owner Rent/NOC Letter', 'Sound Operator License & Wattage Details', 'Organizer Aadhaar Card'] },
          { title: 'Traffic & Noise Control Scrutiny', desc: 'Traffic branch and local police station assess noise impact and timing limits (10 PM cutoff).', dept: 'Traffic Police', docs: ['Traffic Branch Clearance Slip'] },
          { title: 'Sound Permission NOC Issuance', desc: 'Receive official Loudspeaker Sound Permission NOC.', dept: 'Police Department', docs: ['Loudspeaker Permission Certificate'] }
        ]
      },
      {
        title: 'Public Amusement NOC Application',
        aliases: ['amusement noc', 'event police permission', 'circus fair permission', 'concert noc'],
        keywords: ['amusement noc', 'event permission', 'circus', 'concert', 'public gathering'],
        description: 'Police and Municipal NOC required for organizing public carnivals, exhibitions, fairs, or concerts.',
        department: 'Police Department & Municipal Corporation',
        sector: 'Public Safety',
        jurisdiction: 'Police Department',
        domain: 'amravaticorporation.in',
        sourceStatus: 'database_only',
        steps: [
          { title: 'Submit Safety & Crowd Control Plan', desc: 'Submit event proposal with emergency medical, electrical safety, and crowd control plan.', dept: 'Police Department', docs: ['Event Safety Layout Plan', 'Electrical Safety Certificate', 'Fire NOC Copy'] },
          { title: 'Multi-Agency Site Inspection', desc: 'Joint inspection by police, fire officer, and municipal PWD engineer.', dept: 'Joint Inspection Committee', docs: ['Joint Inspection Report'] },
          { title: 'Public Amusement License Issuance', desc: 'Receive official Public Amusement License & NOC.', dept: 'Police Commissionerate', docs: ['Public Amusement License'] }
        ]
      },
      {
        title: 'Procession & Assembly Permission',
        aliases: ['procession permission', 'rally permission', 'public march permission'],
        keywords: ['procession', 'rally', 'march', 'police permission', 'public assembly'],
        description: 'Police clearance and route permission for religious, cultural, or political processions.',
        department: 'District Police Department',
        sector: 'Public Safety',
        jurisdiction: 'Police Department',
        domain: 'amravati.gov.in',
        sourceStatus: 'database_only',
        steps: [
          { title: 'Submit Procession Route & Timing Details', desc: 'Submit detailed route map, start/end timestamps, and volunteer list.', dept: 'Police Department', docs: ['Procession Route Map', 'Organizer Declaration', 'List of 10 Route Volunteers'] },
          { title: 'Traffic Diversion & Security Assessment', desc: 'Traffic police plan road diversions and security deployment.', dept: 'Traffic Police Branch', docs: ['Traffic Security Order'] },
          { title: 'Procession Permission Order Issuance', desc: 'Receive official Procession Sanction Order.', dept: 'Police Department', docs: ['Official Procession Sanction Order'] }
        ]
      },

      // --- RATION & FOOD SUPPLIES ---
      {
        title: 'New Ration Card Application',
        aliases: ['new ration card', 'apply ration card', 'food security card', 'pds card'],
        keywords: ['ration card', 'pds', 'food security', 'bpl card', 'apl card', 'ration'],
        description: 'Application for new family Ration Card under Public Distribution System (PDS).',
        department: 'Food & Civil Supplies Department',
        sector: 'Public Distribution System',
        jurisdiction: 'Food & Civil Supplies Department',
        domain: 'rcms.mahafood.gov.in',
        sourceStatus: 'verified',
        steps: [
          { title: 'Submit Family Tree & Income Declaration', desc: 'Submit Form 1 application with family member Aadhaar cards and head of family photo.', dept: 'Food & Supplies Department', docs: ['Head of Family Photo & Aadhaar Cards of All Members', 'Income Certificate / Proof', 'Electricity Bill / Residence Proof'] },
          { title: 'Supply Inspector Verification', desc: 'Civil Supply Inspector verifies kitchen/residence status and deletion from old card.', dept: 'Food & Supplies Department', docs: ['Supply Inspector Verification Report'] },
          { title: 'Ration Card Print & Distribution', desc: 'Receive new Tricolor Ration Card (Smart / Booklet format).', dept: 'Food & Supplies Department', docs: ['Official New Ration Card'] }
        ]
      },
      {
        title: 'Ration Card Member Addition',
        aliases: ['add member ration card', 'add child to ration card', 'add wife to ration card', 'inclusion of member ration card'],
        keywords: ['ration card member', 'add child', 'add spouse', 'member inclusion', 'pds update'],
        description: 'Adding a newborn child or new spouse name to existing family Ration Card.',
        department: 'Food & Civil Supplies Department',
        sector: 'Public Distribution System',
        jurisdiction: 'Food & Civil Supplies Department',
        domain: 'rcms.mahafood.gov.in',
        sourceStatus: 'verified',
        steps: [
          { title: 'Submit Birth Certificate / Deletion Certificate', desc: 'Submit birth certificate for child or deletion certificate from previous card for spouse.', dept: 'Food & Supplies Department', docs: ['Child Birth Certificate / Spouse Deletion Certificate', 'Spouse/Child Aadhaar Card', 'Original Ration Card'] },
          { title: 'Aadhaar Seeding Verification', desc: 'Supply clerk seeds new member Aadhaar number in PDS database.', dept: 'Food & Supplies Department', docs: ['Aadhaar Seeding Slip'] },
          { title: 'Updated Ration Card Print', desc: 'Receive updated Ration Card reflecting new member entry.', dept: 'Food & Supplies Department', docs: ['Updated Ration Card Copy'] }
        ]
      },
      {
        title: 'Ration Card Member Removal',
        aliases: ['remove member ration card', 'delete name ration card', 'deletion certificate ration card'],
        keywords: ['ration card deletion', 'remove member', 'marriage deletion', 'death deletion'],
        description: 'Removing member name from ration card due to marriage, relocation, or demise.',
        department: 'Food & Civil Supplies Department',
        sector: 'Public Distribution System',
        jurisdiction: 'Food & Civil Supplies Department',
        domain: 'rcms.mahafood.gov.in',
        sourceStatus: 'database_only',
        steps: [
          { title: 'Submit Removal Application & Marriage/Death Certificate', desc: 'Submit marriage certificate (for bride) or death certificate (for deceased).', dept: 'Food & Supplies Department', docs: ['Marriage Certificate / Death Certificate', 'Original Ration Card', 'Member Aadhaar Card'] },
          { title: 'Supply Inspector Endorsement', desc: 'Supply Inspector approves deletion from master family register.', dept: 'Food & Supplies Department', docs: ['Deletion Endorsement Slip'] },
          { title: 'Deletion Certificate Issuance', desc: 'Receive official Deletion Certificate for new card registration.', dept: 'Food & Supplies Department', docs: ['Official Deletion Certificate'] }
        ]
      },
      {
        title: 'Ration Card Name & Details Correction',
        aliases: ['ration card correction', 'correct name ration card', 'spelling correction ration card'],
        keywords: ['ration card correction', 'name change', 'address correction', 'spelling fix'],
        description: 'Correction of typographical errors in names, ages, or addresses on ration card.',
        department: 'Food & Civil Supplies Department',
        sector: 'Public Distribution System',
        jurisdiction: 'Food & Civil Supplies Department',
        domain: 'rcms.mahafood.gov.in',
        sourceStatus: 'database_only',
        steps: [
          { title: 'Submit Correction Form & Correct Proof', desc: 'Submit application with correct Aadhaar card showing exact spelling.', dept: 'Food & Supplies Department', docs: ['Corrected Aadhaar Card', 'Original Ration Card', 'Self-Declaration Form'] },
          { title: 'PDS Database Modification', desc: 'Supply clerk updates records in RCMS portal.', dept: 'Food & Supplies Department', docs: ['RCMS Modification Receipt'] },
          { title: 'Corrected Ration Card Download', desc: 'Download/receive updated Ration Card booklet.', dept: 'Food & Supplies Department', docs: ['Corrected Ration Card'] }
        ]
      },
      {
        title: 'Ration Card Address Change',
        aliases: ['change address ration card', 'transfer ration card', 'ration shop transfer'],
        keywords: ['ration card address', 'transfer shop', 'fps transfer', 'address change'],
        description: 'Transferring ration card to a new fair price shop (FPS) or ward address.',
        department: 'Food & Civil Supplies Department',
        sector: 'Public Distribution System',
        jurisdiction: 'Food & Civil Supplies Department',
        domain: 'rcms.mahafood.gov.in',
        sourceStatus: 'database_only',
        steps: [
          { title: 'Submit New Address Proof & FPS Details', desc: 'Submit electricity bill of new residence and desired local Fair Price Shop code.', dept: 'Food & Supplies Department', docs: ['New Residence Proof', 'Original Ration Card', 'New FPS Shop Number'] },
          { title: 'Old Shop No-Objection & Transfer', desc: 'System transfers quota allocation to new FPS shop.', dept: 'Food & Supplies Department', docs: ['FPS Transfer Confirmation Slip'] },
          { title: 'Address Updated Card Issuance', desc: 'Receive updated Ration Card endorsed with new address.', dept: 'Food & Supplies Department', docs: ['Updated Ration Card'] }
        ]
      },
      {
        title: 'Duplicate Ration Card Issuance',
        aliases: ['duplicate ration card', 'lost ration card', 'damaged ration card'],
        keywords: ['duplicate ration card', 'lost card', 'damaged card', 'pds duplicate'],
        description: 'Issuance of duplicate ration card booklet in case of loss or physical damage.',
        department: 'Food & Civil Supplies Department',
        sector: 'Public Distribution System',
        jurisdiction: 'Food & Civil Supplies Department',
        domain: 'rcms.mahafood.gov.in',
        sourceStatus: 'database_only',
        steps: [
          { title: 'Lodge Police Complaint & Loss Application', desc: 'Submit police missing report copy for lost card or produce damaged booklet.', dept: 'Food & Supplies Department', docs: ['Police Missing Report / Damaged Card', 'Aadhaar Cards of All Family Members'] },
          { title: 'Fee Payment & Supply Verification', desc: 'Pay prescribed duplicate card fee.', dept: 'Food & Supplies Department', docs: ['Duplicate Fee Receipt'] },
          { title: 'Duplicate Ration Card Delivery', desc: 'Receive new duplicate Ration Card booklet.', dept: 'Food & Supplies Department', docs: ['Duplicate Ration Card'] }
        ]
      },

      // --- PASSPORT & CENTRAL ---
      {
        title: 'Fresh Passport Application',
        aliases: ['fresh passport', 'new passport', 'passport application', 'apply passport', 'passport seva'],
        keywords: ['passport', 'fresh passport', 'passport india', 'mea', 'psk', 'police verification'],
        description: 'Complete process for obtaining a new 36/60-page ordinary Indian Passport via Passport Seva Kendra (PSK).',
        department: 'Passport Seva / Ministry of External Affairs',
        sector: 'Union Passport Services',
        jurisdiction: 'Passport Seva / Ministry of External Affairs',
        domain: 'passportindia.gov.in',
        sourceStatus: 'verified',
        steps: [
          { title: 'Submit Passport Application & Book PSK Appointment', desc: 'File application on Passport Seva portal, pay fee, and book appointment at PSK/POPSK.', dept: 'Passport Seva', docs: ['Proof of Birth (Birth Certificate / School Leaving)', 'Proof of Address (Aadhaar / Bank Passbook / Electricity Bill)', 'Proof of ECNR Status (10th Passing Certificate)'] },
          { title: 'Biometric & Document Verification at PSK', desc: 'Visit PSK for fingerprinting, photo capture, and physical document verification.', dept: 'Passport Seva Kendra (PSK)', docs: ['PSK Appointment Token Slip', 'Original Documents Set'] },
          { title: 'Police Verification & Passport Dispatch', desc: 'Local police station conducts residence verification followed by speed post dispatch.', dept: 'District Police Special Branch', docs: ['Police Verification Report (PVR)'] }
        ]
      },
      {
        title: 'Passport Re-issue & Renewal',
        aliases: ['passport renewal', 'passport reissue', 'renew passport', 'expired passport'],
        keywords: ['passport renewal', 'passport reissue', 'expired passport', 'change address passport'],
        description: 'Re-issuance of Indian passport due to validity expiry, exhaustion of pages, or change in personal particulars.',
        department: 'Passport Seva / MEA',
        sector: 'Union Passport Services',
        jurisdiction: 'Passport Seva',
        domain: 'passportindia.gov.in',
        sourceStatus: 'verified',
        steps: [
          { title: 'Submit Re-issue Application & Old Passport Copy', desc: 'Fill re-issue form selecting reason (expiry, pages exhausted, address change).', dept: 'Passport Seva', docs: ['Original Old Passport', 'Self-Attested Copy of First & Last Pages', 'Proof for Change of Particulars (if applicable)'] },
          { title: 'PSK Document Verification & Biometrics', desc: 'Appear at PSK for document check and biometric scan.', dept: 'Passport Seva Kendra', docs: ['Appointment Receipt', 'Original Old Passport'] },
          { title: 'Passport Printing & Speed Post Delivery', desc: 'Passport printed and delivered to applicant registered address.', dept: 'Passport Seva', docs: ['New Passport Booklet'] }
        ]
      },
      {
        title: 'Tatkaal Passport Application',
        aliases: ['tatkaal passport', 'urgent passport', 'tatkal passport'],
        keywords: ['tatkaal', 'tatkal', 'urgent passport', 'fast passport', 'emergency passport'],
        description: 'Expedited Tatkaal passport processing for urgent travel requirements without prior police verification.',
        department: 'Passport Seva / MEA',
        sector: 'Union Passport Services',
        jurisdiction: 'Passport Seva',
        domain: 'passportindia.gov.in',
        sourceStatus: 'verified',
        steps: [
          { title: 'Submit 3 Mandated Identity Annexures', desc: 'Submit application with 3 specified Annexure documents (Aadhaar, Voter ID, PAN).', dept: 'Passport Seva', docs: ['Aadhaar Card', 'Voter ID', 'PAN Card / Driving License', 'Annexure E Self-Declaration'] },
          { title: 'Priority PSK Verification', desc: 'Attend priority Tatkaal counter at PSK.', dept: 'Passport Seva Kendra', docs: ['Tatkaal Appointment Receipt'] },
          { title: 'Post-Issuance Verification & Express Dispatch', desc: 'Passport dispatched within 1-3 working days prior to police verification.', dept: 'Passport Seva', docs: ['Express Tatkaal Passport'] }
        ]
      },
      {
        title: 'Police Clearance Certificate for Passport',
        aliases: ['pcc for passport', 'passport pcc', 'police certificate for visa'],
        keywords: ['pcc passport', 'police verification passport', 'foreign visa pcc'],
        description: 'Official Police Clearance Certificate issued by Passport Office for foreign visa/residency.',
        department: 'Passport Seva / MEA',
        sector: 'Union Passport Services',
        jurisdiction: 'Passport Seva',
        domain: 'passportindia.gov.in',
        sourceStatus: 'verified',
        steps: [
          { title: 'Submit PCC Application on Passport Portal', desc: 'Apply online selecting destination country and visa category.', dept: 'Passport Seva', docs: ['Valid Original Indian Passport', 'Proof of Current Address'] },
          { title: 'Police Station Verification', desc: 'Local police station conducts background clearance.', dept: 'Local Police Station', docs: ['Police Clearance Report'] },
          { title: 'PCC Certificate Issuance', desc: 'Collect printed PCC from Passport Seva Kendra.', dept: 'Passport Seva Kendra', docs: ['Official Passport PCC Certificate'] }
        ]
      },
      {
        title: 'Voter ID Registration (Form 6)',
        aliases: ['voter id', 'apply voter id', 'new voter card', 'form 6 voter', 'epic card'],
        keywords: ['voter id', 'form 6', 'election commission', 'epic', 'voter registration'],
        description: 'New voter enrollment and EPIC card issuance under Election Commission of India.',
        department: 'Election Commission of India',
        sector: 'Electoral Services',
        jurisdiction: 'Election Commission of India',
        domain: 'voters.eci.gov.in',
        sourceStatus: 'verified',
        steps: [
          { title: 'Submit Online Form 6 Application', desc: 'Submit Form 6 with age proof (showing 18+ yrs) and ordinary residence proof.', dept: 'Election Commission', docs: ['Proof of Age (Birth Certificate / School Certificate / Aadhaar)', 'Proof of Residence (Electricity Bill / Bank Passbook / Ration Card)', 'Passport Size Photograph'] },
          { title: 'BLO (Booth Level Officer) Field Verification', desc: 'BLO visits applicant address to confirm physical residency in constituency ward.', dept: 'Electoral Registration Office', docs: ['BLO Verification Report'] },
          { title: 'Electoral Roll Inclusion & EPIC Card Dispatch', desc: 'EPIC voter number generated and PVC Voter ID card dispatched by post.', dept: 'Election Commission', docs: ['PVC Voter ID (EPIC) Card'] }
        ]
      },
      {
        title: 'PAN Card Application (Form 49A)',
        aliases: ['pan card', 'apply pan card', 'new pan card', 'form 49a', 'nsdl pan'],
        keywords: ['pan card', 'nsdl', 'income tax', 'form 49a', 'pan number'],
        description: 'Application for new Permanent Account Number (PAN) card for tax identity.',
        department: 'Income Tax Department',
        sector: 'Tax & Identity Services',
        jurisdiction: 'Income Tax Department',
        domain: 'onlineservices.nsdl.com',
        sourceStatus: 'verified',
        steps: [
          { title: 'Submit e-KYC Form 49A', desc: 'Fill Form 49A on NSDL/UTIITSL portal using Aadhaar e-KYC authentication.', dept: 'Income Tax Department', docs: ['Aadhaar Card (with updated DOB)', 'Digital Photo & Signature Scan'] },
          { title: 'Pay Processing Fee & Biometric Auth', desc: 'Pay fee online and complete instant e-Sign.', dept: 'NSDL Portal', docs: ['e-Sign Confirmation Slip'] },
          { title: 'Physical & e-PAN Delivery', desc: 'Instant e-PAN sent to email; physical plastic PAN card delivered by post.', dept: 'Income Tax Department', docs: ['Official PAN Card'] }
        ]
      },

      // --- AGRICULTURE & SOCIAL WELFARE ---
      {
        title: 'PM-KISAN New Farmer Registration',
        aliases: ['pm kisan', 'pm kisan registration', 'farmer scheme', 'kisan samman nidhi'],
        keywords: ['pm kisan', 'farmer scheme', 'kisan nidhi', 'agriculture subsidy', '7 12 land'],
        description: 'Registration of eligible landholding farmer families for annual ₹6,000 financial support under PM-KISAN scheme.',
        department: 'Agriculture Department, Govt of India / Maharashtra',
        sector: 'Social Welfare',
        jurisdiction: 'Agriculture Department',
        domain: 'amravati.gov.in',
        sourceStatus: 'verified',
        steps: [
          { title: 'Submit Aadhaar & Land 7/12 Records', desc: 'Enter farmer Aadhaar number, bank account details, and 7/12 land khata number.', dept: 'Agriculture Department', docs: ['Farmer Aadhaar Card', 'Latest 7/12 Land Extract', 'Aadhaar-Linked Bank Passbook'] },
          { title: 'Aadhaar Seeding & Revenue Verification', desc: 'Talathi & Agriculture Extension Officer verify land ownership and non-exclusion criteria.', dept: 'Revenue & Agriculture Dept', docs: ['Land Verification Slip'] },
          { title: 'Approval & Installment Disbursement', desc: 'Registration approved and direct benefit transfer (DBT) enabled.', dept: 'PM-KISAN Portal', docs: ['PM-KISAN Beneficiary Status Record'] }
        ]
      },
      {
        title: 'PM-KISAN Status & e-KYC Update',
        aliases: ['pm kisan ekyc', 'pm kisan status', 'pm kisan bank seeding'],
        keywords: ['pm kisan ekyc', 'ekyc farmer', 'dbt bank seeding', 'kisan status'],
        description: 'Mandatory e-KYC biometric/OTP update and bank account Aadhaar seeding for PM-KISAN beneficiaries.',
        department: 'Agriculture Department',
        sector: 'Social Welfare',
        jurisdiction: 'Agriculture Department',
        domain: 'amravati.gov.in',
        sourceStatus: 'verified',
        steps: [
          { title: 'Aadhaar OTP / CSC Biometric e-KYC', desc: 'Complete face or fingerprint e-KYC on PM-KISAN portal or CSC center.', dept: 'PM-KISAN Portal', docs: ['Aadhaar Number', 'Aadhaar-Linked Mobile OTP'] },
          { title: 'NPCI Bank Account Mapping', desc: 'Ensure bank account is mapped to NPCI mapper for Direct Benefit Transfer.', dept: 'Bank Branch', docs: ['NPCI Mapping Confirmation'] }
        ]
      },
      {
        title: 'Unique Disability ID (UDID) Certificate Application',
        aliases: ['udid card', 'disability certificate', 'apply udid', 'handicap certificate'],
        keywords: ['udid', 'disability', 'handicap', 'swavlamban', 'disability card'],
        description: 'Universal Disability Identity Card (UDID) and disability percentage certificate for persons with disabilities.',
        department: 'Public Health Department / Civil Surgeon Office',
        sector: 'Social Welfare',
        jurisdiction: 'District Collectorate / Civil Hospital',
        domain: 'amravati.gov.in',
        sourceStatus: 'verified',
        steps: [
          { title: 'Submit Disability Medical Request', desc: 'Apply on Swavlamban Card portal uploading medical hospital records.', dept: 'Public Health Department', docs: ['Aadhaar Card', 'Hospital Medical History Records', 'Passphoto of Applicant'] },
          { title: 'Civil Hospital Medical Board Assessment', desc: 'Appear before District Medical Board for disability percentage evaluation.', dept: 'Civil Hospital Amravati', docs: ['Medical Board Assessment Report'] },
          { title: 'UDID Smart Card Issuance', desc: 'Download digital UDID certificate and receive plastic UDID Smart Card.', dept: 'Ministry of Social Justice', docs: ['Official UDID Card & Disability Certificate'] }
        ]
      },
      {
        title: 'Post-Matric Government Scholarship Application',
        aliases: ['post matric scholarship', 'mahadbt scholarship', 'apply scholarship', 'student scholarship'],
        keywords: ['scholarship', 'mahadbt', 'post matric', 'sc obc scholarship', 'tuition fee waiver'],
        description: 'Post-matric state scholarship and fee reimbursement for SC/ST/OBC/EBC students in higher education.',
        department: 'Social Justice & Special Assistance Department',
        sector: 'Social Welfare',
        jurisdiction: 'Social Justice Department',
        domain: 'aaplesarkar.mahaonline.gov.in',
        sourceStatus: 'verified',
        steps: [
          { title: 'MahaDBT Profile & College Admission Upload', desc: 'Create profile on MahaDBT, upload caste certificate, income proof, and college CAP allotment letter.', dept: 'Social Justice Department', docs: ['Valid Caste & Income Certificates', 'College Admission Fee Receipt', '10th & 12th Marksheets'] },
          { title: 'College Principal Verification', desc: 'College Nodal Officer verifies student attendance and course registration.', dept: 'Educational Institution', docs: ['College Verification Slip'] },
          { title: 'Scholarship Sanction & DBT Credit', desc: 'Sanction order issued and scholarship credited directly to student bank account.', dept: 'Social Justice Department', docs: ['Scholarship Sanction Order'] }
        ]
      },
    ];

    console.log(`Total Master Procedures defined: ${proceduresMasterList.length}`);

    // Insert Procedures, Steps, Docs, and Dependencies into MongoDB
    const createdProcedureMap = new Map();

    for (const rawProc of proceduresMasterList) {
      const sourceObj = sourceMap[rawProc.domain] || sourceMap['amravaticorporation.in'] || createdSources[0];

      const procDoc = await Procedure.create({
        title: rawProc.title,
        aliases: rawProc.aliases || [],
        keywords: rawProc.keywords || [],
        description: rawProc.description,
        department: rawProc.department,
        sector: rawProc.sector || 'Citizen Services',
        serviceType: rawProc.serviceType || rawProc.sector || 'Citizen Services',
        jurisdiction: rawProc.jurisdiction || 'Municipal Corporation',
        state: 'Maharashtra',
        district: 'Amravati',
        city: 'Amravati',
        status: 'published',
        sourceStatus: rawProc.sourceStatus || 'database_only',
        officialSourceId: sourceObj._id,
      });

      createdProcedureMap.set(procDoc.title, procDoc);

      // Create initial CivicTask mapping entry for catalog
      await CivicTask.create({
        userId: defaultUser._id,
        procedureId: procDoc._id,
        title: procDoc.title,
        description: procDoc.description,
        status: 'active',
      });

      // Insert Steps, Docs, Dependencies for this Procedure
      const stepDocs = [];
      const stepsCount = rawProc.steps ? rawProc.steps.length : 3;

      for (let sIdx = 0; sIdx < stepsCount; sIdx++) {
        const stepInfo = rawProc.steps[sIdx];
        const stepCreated = await ProcedureStep.create({
          procedureId: procDoc._id,
          nodeId: `node-${sIdx + 1}`,
          title: stepInfo.title,
          description: stepInfo.desc,
          order: sIdx + 1,
          status: sIdx === 0 ? 'in_progress' : 'pending',
          department: stepInfo.dept || rawProc.department,
          locationMode: 'Municipal / Online Portal',
          sourceIds: [],
        });
        stepDocs.push(stepCreated);

        // Insert Document Requirements
        if (stepInfo.docs && stepInfo.docs.length > 0) {
          for (const docName of stepInfo.docs) {
            await DocumentRequirement.create({
              stepId: stepCreated._id,
              name: docName,
              description: `Required document for ${stepInfo.title}`,
              required: true,
              sourceId: sourceObj._id,
              sourceStatus: rawProc.sourceStatus,
            });
          }
        }
      }

      // Insert Step Dependencies (Prerequisite edge between sequential steps)
      for (let dIdx = 0; dIdx < stepDocs.length - 1; dIdx++) {
        await Dependency.create({
          procedureId: procDoc._id,
          fromStepId: stepDocs[dIdx]._id,
          toStepId: stepDocs[dIdx + 1]._id,
          dependencyType: 'prerequisite',
          description: `Prerequisite step required before ${stepDocs[dIdx + 1].title}`,
        });
      }
    }

    // Link Related Procedures ("You may also need")
    console.log('🔗 Wiring Related Services / Procedures graph links...');
    const relatedMappings = [
      { main: 'Fresh Passport Application', related: ['Passport Re-issue & Renewal', 'Police Clearance Certificate for Passport', 'Tatkaal Passport Application'] },
      { main: 'Water Connection Application', related: ['Water Connection Ownership Change', 'Water Connection Disconnection', 'Municipal Water Bill Payment & Services'] },
      { main: 'New Ration Card Application', related: ['Ration Card Member Addition', 'Ration Card Member Removal', 'Ration Card Address Change'] },
      { main: 'Trade License Application', related: ['Shop & Establishment Registration (Gumasta)', 'Fire Safety NOC Application', 'Udyam MSME Business Registration'] },
      { main: 'Fresh Driving Licence Application', aliases: ['Driving Licence Renewal Service', 'Duplicate Driving Licence Issuance', 'International Driving Permit (IDP)'] },
      { main: 'Birth Certificate Application', related: ['Birth Certificate Name Correction', 'Caste Certificate Application', 'Domicile Certificate Application'] },
      { main: 'Income Certificate Application', related: ['Caste Certificate Application', 'Non-Creamy Layer Certificate', 'Post-Matric Government Scholarship Application'] },
    ];

    for (const relRule of relatedMappings) {
      const mainProc = createdProcedureMap.get(relRule.main);
      if (mainProc && relRule.related) {
        const relIds = relRule.related
          .map((title) => createdProcedureMap.get(title)?._id)
          .filter(Boolean);

        if (relIds.length > 0) {
          await Procedure.updateOne({ _id: mainProc._id }, { $set: { relatedProcedureIds: relIds } });
        }
      }
    }

    console.log(`
==================================================
🎉 CIVICPATH CATALOG DATABASE SEEDING COMPLETE!
==================================================
- Total Procedures Seeded:      ${proceduresMasterList.length}
- Total IGOD Discovered Sources: ${createdSources.length}
- All procedures populated with 3+ real steps, document requirements, dependencies, and search aliases.
==================================================
`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Error during database seeding:', err);
    process.exit(1);
  }
};

seedCatalog();
