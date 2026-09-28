import { apiFetch } from './api';

export const progressService = {
  async getProgressByTask(civicTaskId: string) {
    return await apiFetch<any>(`/progress/${civicTaskId}`, {
      method: 'GET',
    });
  },

  async updateStepProgress(
    civicTaskId: string,
    stepId: string,
    status: 'not_started' | 'in_progress' | 'completed',
    procedureId?: string
  ) {
    return await apiFetch<any>(`/progress/${civicTaskId}/step`, {
      method: 'PUT',
      body: JSON.stringify({ stepId, status, procedureId }),
    });
  },

  async updateProgress(civicTaskId: string, data: {
    completedSteps?: string[];
    currentStepId?: string;
    percentage?: number;
    procedureId?: string;
    stepId?: string;
    status?: string;
  }) {
    return await apiFetch<any>(`/progress/${civicTaskId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};
