import { apiFetch, setAuthToken, removeAuthToken } from './api';
import { User } from '../types';

export interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  location?: any;
  token: string;
}

export const authService = {
  async register(name: string, email: string, password: string, role: string = 'user') {
    const res = await apiFetch<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    });

    if (res.success && res.data?.token) {
      setAuthToken(res.data.token);
    }
    return res;
  },

  async login(email: string, password: string) {
    const res = await apiFetch<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (res.success && res.data?.token) {
      setAuthToken(res.data.token);
    }
    return res;
  },

  async getMe() {
    return await apiFetch<User>('/auth/me', {
      method: 'GET',
    });
  },

  logout() {
    removeAuthToken();
  },
};
