import { api } from './api'

export interface Team {
  id: string
  name: string
  role: 'admin' | 'member' | 'supervisor'
  joinedAt: string
  createdAt: string
}

export interface SearchedUser {
  id: string
  name: string
  email: string
}

export const teamService = {

  async getTeams(): Promise<Team[]> {
    const response = await api.get('/teams')
    return response.data.data;
  },

  async createTeam(name: string): Promise<Team> {
    const response = await api.post('/teams', { name })
    return response.data.data
  },

  async addMember(teamId: string, userId: string, role: 'admin' | 'member' | 'supervisor') {
    const response = await api.post(`/teams/${teamId}/members`, { userId, role })
    return response.data.data
  },

  async searchUsers(query: string): Promise<SearchedUser[]> {
    const response = await api.get(`/users/search?q=${query}`)
    return response.data.data
  },
}
