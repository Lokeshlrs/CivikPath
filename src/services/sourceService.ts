import { apiFetch } from './api';
import { GovernmentSource } from '../types';

export const sourceService = {
  async getSources(sourceStatus?: string) {
    const endpoint = sourceStatus ? `/sources?sourceStatus=${sourceStatus}` : '/sources';
    return await apiFetch<GovernmentSource[]>(endpoint, {
      method: 'GET',
    });
  },

  async getSourceById(id: string) {
    return await apiFetch<GovernmentSource>(`/sources/${id}`, {
      method: 'GET',
    });
  },

  async createSource(data: any) {
    return await apiFetch<GovernmentSource>('/sources', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateSource(id: string, data: any) {
    return await apiFetch<GovernmentSource>(`/sources/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};
