import { apiFetch } from './api';
import { CivicTask, LocationState } from '../types';

export const taskService = {
  async createTask(title: string, location?: LocationState, answers?: Record<string, string>) {
    return await apiFetch<CivicTask>('/tasks', {
      method: 'POST',
      body: JSON.stringify({ title, location, answers }),
    });
  },

  async getTasks() {
    return await apiFetch<CivicTask[]>('/tasks', {
      method: 'GET',
    });
  },

  async getTaskById(id: string) {
    return await apiFetch<CivicTask>(`/tasks/${id}`, {
      method: 'GET',
    });
  },

  async updateTask(id: string, data: Partial<CivicTask>) {
    return await apiFetch<CivicTask>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};
