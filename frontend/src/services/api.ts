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
  getEmail: (id: string) => api.get(`/emails/${id}`),
  analyzeEmail: (id: string) => api.post(`/emails/${id}/analyze`),
  updateIntelligence: (id: string, data: IntelligenceData) => api.patch(`/emails/${id}/intelligence`, data),

  getSummary: () => api.get('/analytics/summary'),
  getIntents: () => api.get('/analytics/intents'),
};

export default api;
