import { User } from '../types';

export const MOCK_USER: User = {
  id: 'usr-demo-1',
  name: 'Demo Citizen',
  email: 'citizen@example.com',
  role: 'user',
};

export const MOCK_ADMIN_USER: User = {
  id: 'usr-admin-1',
  name: 'CivicPath Administrator',
  email: 'admin@civicpath.gov.in',
  role: 'admin',
};
