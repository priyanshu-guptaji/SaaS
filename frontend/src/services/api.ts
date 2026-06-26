import axios from 'axios';

interface Credentials {
  email?: string;
  password?: string;
}

interface IntelligenceData {
  intent?: string;
  sentiment?: string;
  priority?: string;
  confidence?: number;
  suggestedReply?: string;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
});

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const apiService = {
  signin: (credentials: Credentials) => api.post('/auth/signin', credentials),
  getGoogleAuthUrl: (tenantId: string) => api.get(`/auth/google/url?tenantId=${tenantId}`),

  getEmails: () => api.get('/emails'),
  syncEmails: () => api.post('/emails/sync'),
  getEmail: (id: string) => api.get(`/emails/${id}`),
  analyzeEmail: (id: string) => api.post(`/emails/${id}/analyze`),
  updateIntelligence: (id: string, data: IntelligenceData) => api.patch(`/emails/${id}/intelligence`, data),
  sendReply: (id: string, body: string) => api.post(`/emails/${id}/reply`, { body }),
  assignEmail: (id: string, userId: string) => api.patch(`/emails/${id}/assign`, { userId }),

  getSummary: () => api.get('/analytics/summary'),
  getIntents: () => api.get('/analytics/intents'),

  // Workflows CRUD
  getWorkflows: () => api.get('/workflows'),
  createWorkflow: (data: any) => api.post('/workflows', data),
  updateWorkflow: (id: string, data: any) => api.patch(`/workflows/${id}`, data),
  deleteWorkflow: (id: string) => api.delete(`/workflows/${id}`),

  // Integrations CRUD
  getIntegrations: () => api.get('/integrations'),
  deleteIntegration: (id: string) => api.delete(`/integrations/${id}`),

  // Team CRUD
  getTeam: () => api.get('/team'),
  addTeamMember: (data: any) => api.post('/team', data),
  updateTeamMember: (id: string, role: string) => api.patch(`/team/${id}`, { role }),
  deleteTeamMember: (id: string) => api.delete(`/team/${id}`),

  // Settings & Billing
  getSettings: () => api.get('/settings'),
  updateTenantSettings: (data: any) => api.patch('/settings', data),
  updateUserSettings: (data: any) => api.patch('/settings/profile', data),
  upgradeBilling: (tier: string) => api.post('/settings/billing/upgrade', { tier }),
};

export default api;
