const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export const getAuthToken = (): string | null => {
  return localStorage.getItem('civicpath_token');
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('civicpath_token', token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('civicpath_token');
};

export const apiFetch = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  try {
    const token = getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || `API request failed with status ${response.status}`,
      };
    }

    return data;
  } catch (error: any) {
    console.warn(`[API Abstraction Warning] Unable to reach backend endpoint ${endpoint}:`, error.message);
    return {
      success: false,
      message: error.message || 'Network error: Backend server unavailable',
    };
  }
};
