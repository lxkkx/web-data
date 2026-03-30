import apiClient from './apiClient';

const userService = {
  getMe: async () => {
    const response = await apiClient.get('/users/me');
    return response.data;
  },

  updateProfile: async (userData) => {
    // If it's FormData, it's likely for a picture or legacy, but the main PUT /me expects JSON.
    // We'll let axios decide the content-type unless explicitly told.
    const response = await apiClient.put('/users/me', userData);
    return response.data;
  },

  uploadProfilePicture: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/users/me/upload-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  getStats: async () => {
    const response = await apiClient.get('/users/me/stats');
    return response.data;
  },

  updatePreferences: async (preferences) => {
    const response = await apiClient.put('/users/me/preferences', preferences);
    return response.data;
  },

  searchUsers: async (query) => {
    const response = await apiClient.get(`/users/search?q=${query}`);
    return response.data;
  }
};

export default userService;
