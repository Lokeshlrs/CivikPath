import { GovernmentSource, AdminReviewItem, SourceChangeItem } from '../types';

export const MOCK_GOVERNMENT_SOURCES: GovernmentSource[] = [
  {
    id: 'src-gov-01',
    department: 'National Informatics Centre (NIC)',
    service: 'Integrated Government Online Directory (IGOD)',
    officialDomain: 'igod.gov.in',
    sourceUrl: 'https://igod.gov.in/',
    status: 'verified',
    lastVerified: '2026-09-25',
    healthStatus: 'healthy',
    documentsObtained: [
      'Union & State Portal Directory Index',
      'Ministry & Department Service Links',
    ],
  },
  {
    id: 'src-gov-02',
    department: 'District Collectorate Amravati',
    service: 'District Revenue & Citizen Services',
    officialDomain: 'amravati.gov.in',
    sourceUrl: 'https://amravati.gov.in/en/services/',
    status: 'verified',
    lastVerified: '2026-09-25',
    healthStatus: 'healthy',
    documentsObtained: [
      'Income Certificate Guidelines',
      'Domicile & Caste Verification Rules',
      'Land Records (7/12 & 8A Extracts)',
    ],
  },
  {
    id: 'src-gov-03',
    department: 'Amravati Municipal Corporation',
    service: 'Municipal Public Utilities & Licensing',
    officialDomain: 'amravaticorporation.in',
    sourceUrl: 'https://amravaticorporation.in/',
    status: 'verified',
    lastVerified: '2026-09-25',
    healthStatus: 'healthy',
    documentsObtained: [
      'New Water Connection Guidelines',
      'Trade License (Gumasta) Requirements',
      'Property Tax Rates & Assessment Rules',
    ],
  },
  {
    id: 'src-gov-04',
    department: 'Ministry of External Affairs',
    service: 'Passport Seva Official Portal',
    officialDomain: 'passportindia.gov.in',
    sourceUrl: 'https://passportindia.gov.in/',
    status: 'verified',
    lastVerified: '2026-09-25',
    healthStatus: 'healthy',
    documentsObtained: [
      'Fresh Passport Application Document Advisor',
      'Police Clearance Certificate Rules',
      'Standard Processing Fee Schedule (₹1,500)',
    ],
  },
];

export const MOCK_ADMIN_REVIEWS: AdminReviewItem[] = [
  {
    id: 'rev-01',
    service: 'New Water Connection Application',
    location: 'Amravati, Maharashtra',
    extractedDocuments: [
      'Property Tax Paid Receipt',
      'Owner Identity Proof (Aadhaar/Voter ID)',
      'Site Layout Map',
    ],
    fee: '₹1,200 Connection Fee + Meter Security Deposit',
    department: 'Water Supply Department',
    source: 'Amravati Municipal Corporation Portal',
    officialSourceId: 'src-gov-03',
    extractionConfidence: 98,
    verificationStatus: 'verified',
  },
  {
    id: 'rev-02',
    service: 'Fresh Passport Application',
    location: 'Amravati, Maharashtra',
    extractedDocuments: [
      'Proof of Address (Aadhaar Card / Utility Bill)',
      'Proof of Date of Birth (Birth Certificate / Class 10 Certificate)',
      'Photo ID Proof',
    ],
    fee: '₹1,500 Standard Fee',
    department: 'Ministry of External Affairs',
    source: 'Passport Seva Official Portal',
    officialSourceId: 'src-gov-04',
    extractionConfidence: 99,
    verificationStatus: 'verified',
  },
];

export const MOCK_SOURCE_CHANGES: SourceChangeItem[] = [
  {
    id: 'chg-01',
    service: 'Trade License (Gumasta) Application',
    source: 'Amravati Municipal Corporation Portal',
    officialSourceId: 'src-gov-03',
    detectedDate: '2026-09-24',
    previousInfo: {
      requirement: 'Physical Application Form Submissions at Ward Office',
      fee: '₹1,000 Annual Renewal Fee',
      validity: '1 Year validity',
    },
    newInfo: {
      requirement: 'Self-declaration upload via Online AMC Portal',
      fee: '₹1,000 Annual Fee (Online UPI / NetBanking)',
      validity: 'Auto-renewal option for 3 Years',
    },
    status: 'approved',
  },
];
