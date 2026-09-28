import { apiFetch } from './api';
import { CivicProcedure } from '../types';

export const procedureService = {
  async getProcedures(params?: { state?: string; district?: string; city?: string; search?: string }) {
    const query = new URLSearchParams(params as any).toString();
    const endpoint = query ? `/procedures?${query}` : '/procedures';
    return await apiFetch<CivicProcedure[]>(endpoint, {
      method: 'GET',
    });
  },

  async getProcedureById(id: string) {
    return await apiFetch<CivicProcedure>(`/procedures/${id}`, {
      method: 'GET',
    });
  },

  async getProcedureFullGraph(id: string) {
    return await apiFetch<{
      procedure: any;
      steps: any[];
      dependencies: any[];
      documents: any[];
      sources: any[];
    }>(`/procedures/${id}/graph`, {
      method: 'GET',
    });
  },

  async createProcedure(data: any) {
    return await apiFetch<CivicProcedure>('/procedures', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateProcedure(id: string, data: any) {
    return await apiFetch<CivicProcedure>(`/procedures/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};
