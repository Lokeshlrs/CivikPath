export type StepStatus = 'completed' | 'current' | 'pending' | 'needs_attention' | 'not_started' | 'in_progress';
export type SourceVerificationStatus = 'demo' | 'verified' | 'review_required' | 'inactive' | 'unverified';
export type SourceHealthStatus = 'healthy' | 'needs_review' | 'unavailable';
export type DocumentStatus = 'ready' | 'pending' | 'needs_attention';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface CivicTask {
  id: string;
  title: string;
  description?: string;
  category?: string;
}

export interface LocationState {
  state: string;
  district: string;
  city: string;
  detected: boolean;
  rawLocationString: string;
}

export interface QuestionOption {
  id: string;
  label: string;
  description?: string;
  icon?: string;
}

export interface ClarificationQuestion {
  id: string;
  questionNumber: number;
  totalQuestions: number;
  title: string;
  description: string;
  explanation: string;
  options: QuestionOption[];
  selectedOptionId?: string;
}

export interface ProcedureStep {
  id: string;
  nodeId?: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  status: StepStatus;
  sourceStatus: SourceVerificationStatus;
  department: string;
  where: string;
  fee?: string;
  estimatedTime?: string;
  nextStepId?: string;
  nextStepTitle?: string;
  isDocument?: boolean;
  documentRequirements?: DocumentRequirement[];
  whyRequired?: string;
  officialSource?: string;
  officialSourceId?: string;
  officialSourceUrl?: string;
  applicationLink?: string;
}

export interface Dependency {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface CivicProcedure {
  id: string;
  procedureId?: string;
  title: string;
  location: string;
  progressPercentage: number;
  completedStepsCount: number;
  totalStepsCount: number;
  steps: ProcedureStep[];
  dependencies: Dependency[];
  officialSourceVerified?: boolean;
  officialSourceUrl?: string;
  databaseGrounded?: boolean;
  groundingStatus?: string;
  sources?: any[];
  relatedServices?: Array<{
    id: string;
    title: string;
    sector: string;
    department: string;
    description: string;
  }>;
}

export interface DocumentRequirement {
  id: string;
  name: string;
  status: DocumentStatus;
  sourceStatus: SourceVerificationStatus;
  department: string;
  officialSource: string;
  officialSourceId: string;
  whyRequired: string;
  stepId: string;
}

export interface GovernmentSource {
  id: string;
  department: string;
  service: string;
  officialDomain: string;
  sourceUrl: string;
  status: SourceVerificationStatus;
  lastVerified: string;
  healthStatus: SourceHealthStatus;
  documentsObtained: string[];
}

export interface AdminReviewItem {
  id: string;
  service: string;
  location: string;
  extractedDocuments: string[];
  fee: string;
  department: string;
  source: string;
  officialSourceId: string;
  extractionConfidence: number; // e.g. 78%
  verificationStatus: 'pending_human_review' | 'verified' | 'rejected';
}

export interface SourceChangeItem {
  id: string;
  service: string;
  source: string;
  officialSourceId: string;
  detectedDate: string;
  previousInfo: {
    requirement: string;
    fee: string;
    validity?: string;
  };
  newInfo: {
    requirement: string;
    fee: string;
    validity?: string;
  };
  status: 'pending' | 'approved' | 'rejected';
}
