import apiClient from './apiClient';

const authService = {
  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  forgotPassword: async (email) => {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data;
  },

  verifyResetCode: async (email, code) => {
    const response = await apiClient.post('/auth/verify-reset-code', { email, code });
    return response.data;
  },

  resetPassword: async (token, newPassword) => {
    const response = await apiClient.post('/auth/reset-password', { token, new_password: newPassword });
    return response.data;
  }
};

export default authService;
