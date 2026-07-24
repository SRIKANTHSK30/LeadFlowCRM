const API_URL = 'https://leadflowcrm-api.onrender.com/api';

export const api = {
  async request(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Request failed');
    }
    
    return response.json();
  },
  
  auth: {
    register: (data: any) => api.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    login: (data: any) => api.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  },
  
  leads: {
    getAll: (params?: any) => {
      const query = params ? `?${new URLSearchParams(params)}` : '';
      return api.request(`/leads${query}`);
    },
    create: (data: any) => api.request('/leads', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id: string, data: any) => api.request(`/leads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id: string) => api.request(`/leads/${id}`, {
      method: 'DELETE',
    }),
    addNote: (id: string, content: string) => api.request(`/leads/${id}/notes`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),
    getNotes: (id: string) => api.request(`/leads/${id}/notes`),
  },
  
  user: {
    profile: () => api.request('/users/profile'),
  },
};