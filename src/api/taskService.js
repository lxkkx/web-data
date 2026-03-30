import apiClient from './apiClient';

const taskService = {
  getAllTasks: async (params = {}) => {
    const response = await apiClient.get('/tasks/', { params });
    return response.data;
  },

  getTaskSummary: async () => {
    const response = await apiClient.get('/tasks/summary');
    return response.data;
  },

  getTaskById: async (id) => {
    const response = await apiClient.get(`/tasks/${id}`);
    return response.data;
  },

  createTask: async (taskData) => {
    const response = await apiClient.post('/tasks/', taskData);
    return response.data;
  },

  updateTask: async (id, taskData) => {
    const response = await apiClient.patch(`/tasks/${id}`, taskData);
    return response.data;
  },

  completeTask: async (id) => {
    const response = await apiClient.patch(`/tasks/${id}/complete`);
    return response.data;
  },

  deleteTask: async (id) => {
    const response = await apiClient.delete(`/tasks/${id}`);
    return response.data;
  },

  getNearbyTasks: async (lat, lng, radiusKm = 5.0) => {
    const response = await apiClient.get('/tasks/nearby', {
      params: { latitude: lat, longitude: lng, radius_km: radiusKm }
    });
    return response.data;
  },

  getCalendarTasks: async (year, month) => {
    const response = await apiClient.get('/tasks/calendar', {
      params: { year, month }
    });
    return response.data;
  },

  getTasksByCategories: async () => {
    const response = await apiClient.get('/tasks/categories');
    return response.data;
  }
};

export default taskService;
