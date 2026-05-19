import { api } from './api'

export interface Task {
  id: string
  title: string
  description: string
  status: 'completed' | 'in_progress' | 'not_started'
  deadline: string
  projectId: string
  isTimerRunning: boolean
}

export const taskService = {
  async getTasksByProject(projectId: string): Promise<Task[]> {
    const response = await api.get(`/tasks?projectId=${projectId}`)
    return response.data.data
  },

  // 1. Rota de Criação testada no Insomnia
  async createTask(data: {
    title: string
    description: string
    deadline: string
    projectId: string
    assigneeIds: string[]
  }) {
    const response = await api.post('/tasks', data)
    return response.data.data
  },

  // 2. Rota de Iniciar Cronômetro testada no Insomnia
  async startTimer(taskId: string) {
    const response = await api.post(`/tasks/${taskId}/start`)
    return response.data
  },

  // 3. Rota de Pausar Cronômetro testada no Insomnia
  async stopTimer(taskId: string) {
    const response = await api.post(`/tasks/${taskId}/stop`)
    return response.data
  },

  // 4. Rota de Conclusão testada no Insomnia
  async completeTask(taskId: string) {
    const response = await api.patch(`/tasks/${taskId}/complete`)
    return response.data
  },
}
