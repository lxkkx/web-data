import apiClient from './apiClient';

const teamService = {
  getTeams: async () => {
    const response = await apiClient.get('/teams/');
    return response.data;
  },

  getTeamById: async (id) => {
    const response = await apiClient.get(`/teams/${id}`);
    return response.data;
  },

  createTeam: async (teamData) => {
    const response = await apiClient.post('/teams/', teamData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
  },

  inviteMember: async (id, inviteData) => {
    const response = await apiClient.post(`/teams/${id}/invite`, inviteData);
    return response.data;
  },

  getTeamMembers: async (id) => {
    const response = await apiClient.get(`/teams/${id}/members`);
    return response.data;
  },

  getMemberProfile: async (teamId, userId) => {
    const response = await apiClient.get(`/teams/${teamId}/members/${userId}`);
    return response.data;
  },

  assignTask: async (teamId, assignmentData) => {
    const response = await apiClient.post(`/teams/${teamId}/assign-task`, assignmentData);
    return response.data;
  },

  getTeamTasks: async (teamId) => {
    const response = await apiClient.get(`/teams/${teamId}/tasks`);
    return response.data;
  },

  getChatMessages: async (teamId) => {
    const response = await apiClient.get(`/teams/${teamId}/chat`);
    return response.data;
  },

  sendChatMessage: async (teamId, message) => {
    const response = await apiClient.post(`/teams/${teamId}/chat`, { message });
    return response.data;
  },

  getTeamAnalysis: async (teamId) => {
    const response = await apiClient.get(`/teams/${teamId}/analysis`);
    return response.data;
  }
};

export default teamService;
