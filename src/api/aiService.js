import apiClient from './apiClient';

const aiService = {
  chat: async (query, queryType = 'general') => {
    const response = await apiClient.post('/ai/chat', { query, query_type: queryType });
    return response.data;
  },

  getSuggestions: async () => {
    const response = await apiClient.get('/ai/suggestions');
    return response.data;
  },

  getProductivityInsights: async () => {
    const response = await apiClient.get('/ai/productivity-insights');
    return response.data;
  },

  getDeadlineRisks: async () => {
    const response = await apiClient.get('/ai/deadline-risks');
    return response.data;
  },

  getSmartReschedule: async () => {
    const response = await apiClient.get('/ai/smart-reschedule');
    return response.data;
  },

  getChatHistory: async () => {
    const response = await apiClient.get('/ai/history');
    return response.data;
  }
};

export default aiService;
