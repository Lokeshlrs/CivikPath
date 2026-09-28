import { apiFetch } from './api';

export const adminService = {
  async getPendingVerifications() {
    return await apiFetch<any[]>('/verifications/pending', {
      method: 'GET',
    });
  },

  async approveVerification(id: string, comment?: string, extractedData?: any) {
    return await apiFetch(`/verifications/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify({ comment, extractedData }),
    });
  },

  async rejectVerification(id: string, comment?: string) {
    return await apiFetch(`/verifications/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ comment }),
    });
  },
};
