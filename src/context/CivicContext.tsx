import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  CivicTask,
  LocationState,
  CivicProcedure,
  ProcedureStep,
  DocumentRequirement,
  GovernmentSource,
  AdminReviewItem,
  SourceChangeItem,
  User,
  StepStatus,
} from '../types';
import { isPlaceholder } from '../utils/placeholderUtils';
import { MOCK_TASKS } from '../data/mockTasks';
import { MOCK_DOCUMENT_CHECKLIST } from '../data/mockProcedures';
import { MOCK_GOVERNMENT_SOURCES, MOCK_ADMIN_REVIEWS, MOCK_SOURCE_CHANGES } from '../data/mockSources';
import { MOCK_USER, MOCK_ADMIN_USER } from '../data/mockUsers';
import { authService, sourceService, adminService, procedureService, progressService, GuidedServiceResponse } from '../services';

interface CivicContextType {
  // User state
  currentUser: User | null;
  isAdminLoggedIn: boolean;
  registerUser: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  loginUser: (email: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  loginAdmin: (email: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  authPromptMessage: string | null;
  setAuthPromptMessage: (msg: string | null) => void;

  // Task & Location Flow State
  currentTaskInput: string;
  setCurrentTaskInput: (task: string) => void;
  location: LocationState;
  setLocation: React.Dispatch<React.SetStateAction<LocationState>>;
  questionAnswers: Record<string, string>;
  setQuestionAnswer: (questionId: string, optionId: string) => void;
  
  // Procedure & Roadmap State
  activeProcedure: CivicProcedure;
  setActiveProcedure: React.Dispatch<React.SetStateAction<CivicProcedure>>;
  setGuidedProcedure: (res: GuidedServiceResponse) => void;
  selectedStep: ProcedureStep;
  setSelectedStep: (step: ProcedureStep) => void;
  documents: DocumentRequirement[];
  toggleDocumentStatus: (docId: string) => void;
  updateStepStatus: (stepId: string, newStatus: StepStatus) => Promise<{ success: boolean; message?: string }>;

  // Admin Data & Actions
  sources: GovernmentSource[];
  adminReviews: AdminReviewItem[];
  sourceChanges: SourceChangeItem[];
  approveReview: (id: string) => Promise<void>;
  rejectReview: (id: string) => Promise<void>;
  approveChange: (id: string) => void;
  rejectChange: (id: string) => void;
  toggleSourceStatus: (sourceId: string) => Promise<void>;
  updateStepInProcedure: (updatedStep: ProcedureStep) => void;
}

const CivicContext = createContext<CivicContextType | undefined>(undefined);

export const CivicProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [authPromptMessage, setAuthPromptMessage] = useState<string | null>(null);

  const [currentTaskInput, setCurrentTaskInput] = useState<string>('');
  const [location, setLocation] = useState<LocationState>({
    state: 'Maharashtra',
    district: 'Amravati',
    city: 'Amravati',
    detected: true,
    rawLocationString: 'Amravati, Maharashtra',
  });

  const [questionAnswers, setQuestionAnswers] = useState<Record<string, string>>({});

  const loadPersistedProcedure = (): CivicProcedure | null => {
    try {
      const stored = sessionStorage.getItem('civicpath_active_procedure');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && Array.isArray(parsed.steps) && parsed.steps.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('[CivicContext] Failed loading procedure from sessionStorage:', e);
    }
    return null;
  };

  const initialProc = loadPersistedProcedure();

  const [activeProcedure, setActiveProcedure] = useState<CivicProcedure | null>(initialProc);
  const [selectedStep, setSelectedStep] = useState<ProcedureStep | null>(
    initialProc && initialProc.steps.length > 0 ? initialProc.steps[0] : null
  );
  const [documents, setDocuments] = useState<DocumentRequirement[]>(MOCK_DOCUMENT_CHECKLIST);

  const [sources, setSources] = useState<GovernmentSource[]>(MOCK_GOVERNMENT_SOURCES);
  const [adminReviews, setAdminReviews] = useState<AdminReviewItem[]>(MOCK_ADMIN_REVIEWS);
  const [sourceChanges, setSourceChanges] = useState<SourceChangeItem[]>(MOCK_SOURCE_CHANGES);

  const clearActiveProcedure = () => {
    setActiveProcedure(null);
    setSelectedStep(null);
    try {
      sessionStorage.removeItem('civicpath_active_procedure');
    } catch (e) {}
  };

  // Set active procedure dynamically from backend AI guided service response
  const setGuidedProcedure = (res: GuidedServiceResponse) => {
    if (!res || !res.matched || !res.task || !res.roadmap) {
      clearActiveProcedure();
      return;
    }

    const mappedSteps: ProcedureStep[] = res.roadmap.map((step, idx) => {
      const rawDept = step.department;
      const cleanDept = isPlaceholder(rawDept) ? null : rawDept;

      const validDocs = (step.documents || []).filter((d) => !isPlaceholder(d));
      const hasStepSources = Array.isArray(step.sources) && step.sources.length > 0;
      const stepVerified = (step.provenance?.officialSourceVerified && hasStepSources) || false;
      const stepSourceStatus = stepVerified
        ? 'verified'
        : (step.sourceStatus === 'demo' ? 'demo' : (res.grounding?.status || 'database_only'));

      const verifiedStepSourceTitle = stepVerified ? step.sources?.[0]?.title : undefined;
      const verifiedStepSourceId = stepVerified ? step.sources?.[0]?.sourceId : undefined;
      const verifiedStepSourceUrl = stepVerified ? step.sources?.[0]?.url : undefined;

      const stepIdStr = step.stepId || `step-${idx + 1}`;
      const existingStep = activeProcedure?.steps?.find((s) => s.id === stepIdStr || s.title === step.title);
      const stepStatus = existingStep ? existingStep.status : (idx === 0 ? 'in_progress' : 'pending');

      return {
        id: stepIdStr,
        nodeId: `node-${idx + 1}`,
        title: step.title,
        shortDescription: step.description,
        fullDescription: step.description,
        status: stepStatus as StepStatus,
        sourceStatus: stepSourceStatus as any,
        department: cleanDept as any,
        where: step.locationMode || 'Municipal Office',
        fee: undefined,
        estimatedTime: undefined,
        nextStepId: res.roadmap[idx + 1] ? (res.roadmap[idx + 1].stepId || `step-${idx + 2}`) : undefined,
        nextStepTitle: res.roadmap[idx + 1] ? res.roadmap[idx + 1].title : undefined,
        isDocument: validDocs.length > 0,
        documentRequirements: validDocs.map((docName, dIdx) => ({
          id: `doc-${idx + 1}-${dIdx + 1}`,
          name: docName,
          status: 'pending',
          sourceStatus: stepSourceStatus as any,
          department: cleanDept || 'Municipal Office',
          officialSource: verifiedStepSourceTitle || 'Unverified Source',
          officialSourceId: verifiedStepSourceId || 'src-unverified',
          whyRequired: `Required document for ${res.task?.title || 'procedure'}`,
          stepId: stepIdStr,
        })),
        whyRequired: `Procedural step required for ${res.task?.title || 'procedure'}.`,
        officialSource: verifiedStepSourceTitle,
        officialSourceId: verifiedStepSourceId,
        officialSourceUrl: verifiedStepSourceUrl,
      };
    });

    const mappedDeps: Dependency[] = [];
    for (let i = 0; i < mappedSteps.length - 1; i++) {
      mappedDeps.push({
        id: `dep-${i + 1}`,
        source: mappedSteps[i].id,
        target: mappedSteps[i + 1].id,
        label: 'Prerequisite',
      });
    }

    const procOfficialUrl =
      (res.task as any)?.officialSourceUrl ||
      (res.sources && res.sources.length > 0 ? res.sources[0]?.url : undefined);

    const completedCount = mappedSteps.filter((s) => s.status === 'completed').length;
    const totalCount = mappedSteps.length;
    const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    const newProcedure: CivicProcedure = {
      id: res.task.taskId,
      procedureId: res.task.procedureId || res.task.taskId,
      title: res.task.title,
      location: 'Amravati, Maharashtra',
      progressPercentage: pct,
      completedStepsCount: completedCount,
      totalStepsCount: mappedSteps.length,
      steps: mappedSteps,
      dependencies: mappedDeps,
      officialSourceVerified: res.grounding?.officialSourceVerified || false,
      officialSourceUrl: procOfficialUrl,
      databaseGrounded: res.grounding?.databaseGrounded || true,
      groundingStatus: res.grounding?.status || 'database_only',
      sources: res.sources || [],
      relatedServices: (res as any).relatedServices || [],
    };

    setActiveProcedure(newProcedure);
    setDocuments(mappedSteps.flatMap((s) => s.documentRequirements || []));
    if (mappedSteps.length > 0) {
      const activeSelected = mappedSteps.find((s) => selectedStep && (s.id === selectedStep.id || s.title === selectedStep.title)) || mappedSteps[0];
      setSelectedStep(activeSelected);
    }

    try {
      sessionStorage.setItem('civicpath_active_procedure', JSON.stringify(newProcedure));
    } catch (e) {
      console.warn('[CivicContext] Could not persist procedure to sessionStorage:', e);
    }
  };

  // Sync user progress from backend when logged in
  const syncProgressFromBackend = async (civicTaskId: string) => {
    try {
      const res = await progressService.getProgressByTask(civicTaskId);
      if (res.success && res.data) {
        const completedStepIds = (res.data.completedSteps || []).map((s: any) => s._id || s.id || s);
        
        setActiveProcedure((prev) => {
          if (!prev) return prev;
          const updatedSteps = prev.steps.map((s) => {
            const isDone = completedStepIds.includes(s.id);
            return {
              ...s,
              status: isDone ? ('completed' as StepStatus) : s.status,
            };
          });

          const completedCount = updatedSteps.filter((s) => s.status === 'completed').length;
          const totalCount = updatedSteps.length;
          const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

          const updated = {
            ...prev,
            steps: updatedSteps,
            completedStepsCount: completedCount,
            progressPercentage: res.data.percentage !== undefined ? res.data.percentage : pct,
          };

          try {
            sessionStorage.setItem('civicpath_active_procedure', JSON.stringify(updated));
          } catch (e) {}

          return updated;
        });
      }
    } catch (err) {
      console.warn('[CivicContext] Could not sync user progress from server:', err);
    }
  };

  // Initialize Auth state & load remote sources if backend is available
  useEffect(() => {
    const initAuthAndData = async () => {
      try {
        let currentProc = loadPersistedProcedure();

        if (!currentProc) {
          const defaultGuideRes = await guideCivicService('Water Connection Application');
          if (defaultGuideRes.matched && defaultGuideRes.task && defaultGuideRes.roadmap) {
            setGuidedProcedure(defaultGuideRes);
            currentProc = loadPersistedProcedure();
          }
        } else if (!currentProc.officialSourceUrl && (currentProc.procedureId || currentProc.title)) {
          // Hydrate procedure details & verified officialSourceUrl from MongoDB
          const guideRes = await guideCivicService(currentProc.procedureId || currentProc.title);
          if (guideRes.matched && guideRes.task && guideRes.roadmap) {
            setGuidedProcedure(guideRes);
            currentProc = loadPersistedProcedure();
          }
        }

        const userRes = await authService.getMe();
        if (userRes.success && userRes.data) {
          setCurrentUser(userRes.data);
          if (userRes.data.role === 'admin') {
            setIsAdminLoggedIn(true);
          }
          if (currentProc?.id) {
            await syncProgressFromBackend(currentProc.id);
          }
        }

        const sourceRes = await sourceService.getSources();
        if (sourceRes.success && Array.isArray(sourceRes.data) && sourceRes.data.length > 0) {
          const mappedSources = sourceRes.data.map((src: any) => ({
            id: src._id || src.id,
            department: src.department || 'Government Department',
            service: src.service || src.sourceName || 'Official Service',
            officialDomain: src.officialDomain || src.domain || 'gov.in',
            sourceUrl: src.sourceUrl || src.url || 'https://igod.gov.in',
            status: src.sourceStatus || src.status || 'verified',
            lastVerified: src.lastVerifiedAt ? new Date(src.lastVerifiedAt).toISOString().split('T')[0] : '2026-03-25',
            healthStatus: src.sourceStatus === 'verified' ? 'healthy' : 'needs_review',
            documentsObtained: [],
          }));
          setSources(mappedSources);
        }
      } catch (err) {
        console.warn('[CivicContext] Backend sync fallback to local state:', err);
      }
    };

    initAuthAndData();
  }, []);

  const registerUser = async (name: string, email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await authService.register(name, email, password);
      if (res.success && res.data) {
        setCurrentUser({
          id: res.data._id,
          name: res.data.name,
          email: res.data.email,
          role: res.data.role === 'admin' ? 'admin' : 'user',
        });
        setAuthPromptMessage(null);
        return { success: true };
      } else {
        return { success: false, message: res.message || 'Registration failed' };
      }
    } catch (err: any) {
      return { success: false, message: err.message || 'Registration error' };
    }
  };

  const loginUser = async (email: string, password: string = 'Password123!'): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await authService.login(email, password);
      if (res.success && res.data) {
        setCurrentUser({
          id: res.data._id,
          name: res.data.name,
          email: res.data.email,
          role: res.data.role === 'admin' ? 'admin' : 'user',
        });
        if (activeProcedure?.id) {
          await syncProgressFromBackend(activeProcedure.id);
        }
        setAuthPromptMessage(null);
        return { success: true };
      } else {
        return { success: false, message: res.message || 'Invalid email or password' };
      }
    } catch (err: any) {
      return { success: false, message: err.message || 'Login error' };
    }
  };

  const loginAdmin = async (email: string, password: string = 'AdminPassword123!'): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await authService.login(email, password);
      if (res.success && res.data && res.data.role === 'admin') {
        setIsAdminLoggedIn(true);
        setCurrentUser({
          id: res.data._id,
          name: res.data.name,
          email: res.data.email,
          role: 'admin',
        });
        setAuthPromptMessage(null);
        return { success: true };
      } else {
        return { success: false, message: res.message || 'Admin authentication failed' };
      }
    } catch (err: any) {
      return { success: false, message: err.message || 'Admin login error' };
    }
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
    setIsAdminLoggedIn(false);
    setAuthPromptMessage(null);
  };

  const setQuestionAnswer = (questionId: string, optionId: string) => {
    setQuestionAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const toggleDocumentStatus = (docId: string) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === docId
          ? { ...doc, status: doc.status === 'ready' ? 'pending' : 'ready' }
          : doc
      )
    );
  };

  // Phase 5B: Update Step Progress with Dependency Enforcement & Auth Checks
  const updateStepStatus = async (
    stepId: string,
    newStatus: StepStatus
  ): Promise<{ success: boolean; message?: string }> => {
    if (!currentUser) {
      setAuthPromptMessage('Sign in to save your progress.');
      return { success: false, message: 'Sign in to save your progress.' };
    }

    const targetStep = activeProcedure.steps.find((s) => s.id === stepId || s.nodeId === stepId);
    if (!targetStep) {
      return { success: false, message: 'Step not found in procedure' };
    }

    if (newStatus === 'in_progress' || newStatus === 'completed') {
      const stepNodeId = targetStep.nodeId || targetStep.id;
      const incomingDeps = activeProcedure.dependencies.filter(
        (dep) => dep.target === stepNodeId || dep.target === targetStep.id
      );

      for (const dep of incomingDeps) {
        const prereqStep = activeProcedure.steps.find(
          (s) => s.id === dep.source || s.nodeId === dep.source
        );
        if (prereqStep && prereqStep.status !== 'completed') {
          return {
            success: false,
            message: `Prerequisite step "${prereqStep.title}" must be completed first`,
          };
        }
      }
    }

    try {
      const backendStatus =
        newStatus === 'completed'
          ? 'completed'
          : newStatus === 'in_progress' || newStatus === 'current'
          ? 'in_progress'
          : 'not_started';

      const res = await progressService.updateStepProgress(
        activeProcedure.id,
        targetStep.id,
        backendStatus,
        activeProcedure.procedureId || activeProcedure.id
      );

      if (res.success) {
        setActiveProcedure((prev) => {
          const updatedSteps = prev.steps.map((s) => {
            if (s.id === targetStep.id || s.nodeId === targetStep.nodeId) {
              return { ...s, status: newStatus };
            }
            return s;
          });

          const completedCount = updatedSteps.filter((s) => s.status === 'completed').length;
          const totalCount = updatedSteps.length;
          const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

          return {
            ...prev,
            steps: updatedSteps,
            completedStepsCount: completedCount,
            progressPercentage: res.data?.percentage !== undefined ? res.data.percentage : pct,
          };
        });

        if (selectedStep.id === targetStep.id) {
          setSelectedStep((prev) => ({ ...prev, status: newStatus }));
        }

        return { success: true };
      } else {
        return { success: false, message: res.message || 'Failed to update step progress' };
      }
    } catch (err: any) {
      return { success: false, message: err.message || 'Error updating step progress' };
    }
  };

  const approveReview = async (id: string) => {
    await adminService.approveVerification(id);
    setAdminReviews((prev) =>
      prev.map((item) => (item.id === id ? { ...item, verificationStatus: 'verified' } : item))
    );
  };

  const rejectReview = async (id: string) => {
    await adminService.rejectVerification(id);
    setAdminReviews((prev) =>
      prev.map((item) => (item.id === id ? { ...item, verificationStatus: 'rejected' } : item))
    );
  };

  const approveChange = (id: string) => {
    setSourceChanges((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'approved' } : item))
    );
  };

  const rejectChange = (id: string) => {
    setSourceChanges((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'rejected' } : item))
    );
  };

  const toggleSourceStatus = async (sourceId: string) => {
    const currentSource = sources.find((s) => s.id === sourceId);
    const newStatus = currentSource?.status === 'verified' ? 'review_required' : 'verified';

    await sourceService.updateSource(sourceId, { sourceStatus: newStatus });
    setSources((prev) =>
      prev.map((src) =>
        src.id === sourceId
          ? { ...src, status: newStatus as any }
          : src
      )
    );
  };

  const updateStepInProcedure = (updatedStep: ProcedureStep) => {
    setActiveProcedure((prev) => ({
      ...prev,
      steps: prev.steps.map((s) => (s.id === updatedStep.id ? updatedStep : s)),
    }));
    if (selectedStep.id === updatedStep.id) {
      setSelectedStep(updatedStep);
    }
  };

  return (
    <CivicContext.Provider
      value={{
        currentUser,
        isAdminLoggedIn,
        registerUser,
        loginUser,
        loginAdmin,
        logout,
        authPromptMessage,
        setAuthPromptMessage,
        currentTaskInput,
        setCurrentTaskInput,
        location,
        setLocation,
        questionAnswers,
        setQuestionAnswer,
        activeProcedure,
        setActiveProcedure,
        setGuidedProcedure,
        selectedStep,
        setSelectedStep,
        documents,
        toggleDocumentStatus,
        updateStepStatus,
        sources,
        adminReviews,
        sourceChanges,
        approveReview,
        rejectReview,
        approveChange,
        rejectChange,
        toggleSourceStatus,
        updateStepInProcedure,
      }}
    >
      {children}
    </CivicContext.Provider>
  );
};

export const useCivic = () => {
  const context = useContext(CivicContext);
  if (!context) {
    throw new Error('useCivic must be used within a CivicProvider');
  }
  return context;
};
