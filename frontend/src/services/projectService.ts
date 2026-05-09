import { api } from './api'

export interface Project {
  id: string
  title: string
  description: string
  deadline: string
  supervisorId: string
  totalTasks: number
  completedTasks: number
  progress: number
  deadlineStatus: 'Em dia' | 'Atrasado'
}

export const projectService = {
  async getProjects(): Promise<Project[]> {
    const response = await api.get('/projects')
    return response.data.data
  },

  async deleteProject(projectId: string): Promise<void> {
    await api.delete(`/projects/${projectId}`)
  },
}
