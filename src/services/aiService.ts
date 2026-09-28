import { apiFetch } from './api';

export interface AiAskSource {
  sourceId: string;
  title: string;
  url: string;
  officialDomain?: string;
  lastCheckedAt?: string;
  verificationStatus: string;
}

export interface AiAskResponse {
  success: boolean;
  statusCode: number;
  answer: string;
  sources: AiAskSource[];
  grounded: boolean;
  message?: string;
}

export interface GuidedRoadmapStep {
  stepId?: string;
  stepNumber: number;
  title: string;
  description: string;
  department?: string | null;
  locationMode?: string;
  documents: string[];
  documentsVerified?: boolean;
  dependencies: string[];
  provenance?: {
    database: boolean;
    officialSourceVerified: boolean;
  };
}

export interface GuidedServiceResponse {
  success: boolean;
  statusCode?: number;
  matched: boolean;
  grounded: boolean;
  grounding?: {
    databaseGrounded: boolean;
    officialSourceVerified: boolean;
    status: string;
  };
  task?: {
    taskId: string;
    title: string;
    description: string;
  };
  guidance: string;
  roadmap: GuidedRoadmapStep[];
  sources: AiAskSource[];
  message?: string;
}

export const askCivicAi = async (question: string): Promise<AiAskResponse> => {
  const cleanQuestion = question ? question.trim() : '';
  
  if (!cleanQuestion) {
    return {
      success: false,
      statusCode: 400,
      answer: 'Please enter a valid, non-empty question for CivicPath AI Guidance.',
      sources: [],
      grounded: false,
    };
  }

  try {
    const res = await apiFetch<AiAskResponse>('/ai/ask', {
      method: 'POST',
      body: JSON.stringify({ question: cleanQuestion }),
    });

    if (res.data) {
      return res.data;
    }

    if (res.success && (res as any).answer) {
      return res as unknown as AiAskResponse;
    }

    return {
      success: res.success ?? false,
      statusCode: res.success ? 200 : 500,
      answer: res.message || res.error || "CivicPath could not verify this information from the approved official government sources currently available.",
      sources: (res as any).sources || [],
      grounded: (res as any).grounded || false,
    };
  } catch (error: any) {
    console.error('[AiService Error] Failed to contact AI guidance endpoint:', error);
    return {
      success: false,
      statusCode: 500,
      answer: 'Network Error: Unable to reach CivicPath backend service. Please check your connection.',
      sources: [],
      grounded: false,
    };
  }
};

export const guideCivicService = async (question: string): Promise<GuidedServiceResponse> => {
  const cleanQuestion = question ? question.trim() : '';

  if (!cleanQuestion) {
    return {
      success: false,
      matched: false,
      grounded: false,
      guidance: 'Please enter a valid, non-empty question for CivicPath Guidance.',
      roadmap: [],
      sources: [],
    };
  }

  try {
    const res = await apiFetch<GuidedServiceResponse>('/ai/guide', {
      method: 'POST',
      body: JSON.stringify({ question: cleanQuestion }),
    });

    if (res.data) {
      return res.data;
    }

    if (res.success && (res as any).guidance) {
      return res as unknown as GuidedServiceResponse;
    }

    return {
      success: res.success ?? false,
      matched: (res as any).matched ?? false,
      grounded: (res as any).grounded ?? false,
      guidance: res.message || (res as any).guidance || 'CivicPath does not currently have a verified roadmap for this service.',
      roadmap: (res as any).roadmap || [],
      sources: (res as any).sources || [],
    };
  } catch (error: any) {
    console.error('[AiService Error] Failed to contact AI guide endpoint:', error);
    return {
      success: false,
      matched: false,
      grounded: false,
      guidance: 'Network Error: Unable to reach CivicPath backend service. Please check your connection.',
      roadmap: [],
      sources: [],
    };
  }
};
