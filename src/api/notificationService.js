import apiClient from './apiClient';

const notificationService = {
  getNotifications: async (params = {}) => {
    const response = await apiClient.get('/notifications/', { params });
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await apiClient.get('/notifications/unread-count');
    return response.data;
  },

  markAsRead: async (id) => {
    const response = await apiClient.patch(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await apiClient.patch('/notifications/mark-all-read');
    return response.data;
  },

  deleteNotification: async (id) => {
    const response = await apiClient.delete(`/notifications/${id}`);
    return response.data;
  }
};

export default notificationService;
