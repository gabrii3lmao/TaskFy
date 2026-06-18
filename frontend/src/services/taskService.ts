import { api } from './api'

export interface Task {
  id: string
  title: string
  description: string
  status: 'completed' | 'in_progress' | 'not_started'
  deadline: string
  projectId: string
  parentTaskId?: string
  projectName?: string
  isTimerRunning: boolean
}

export const taskService = {
  async getMyTasks(): Promise<Task[]> {
    const response = await api.get('/tasks/my-tasks')
    return response.data.data
  },

  async getTasksByProject(projectId: string): Promise<Task[]> {
    const response = await api.get(`/tasks?projectId=${projectId}`)
    return response.data.data
  },

  async createTask(data: {
    title: string
    description?: string
    deadline: string
    projectId: string
    parentTaskId?: string
    assigneeIds: string[]
  }) {
    const response = await api.post('/tasks', data)
    return response.data.data
  },

  async updateTask(
    taskId: string,
    data: Partial<{
      title: string
      description: string
      deadline: string
      status: 'not_started' | 'in_progress' | 'completed'
    }>,
  ) {
    const response = await api.patch(`/tasks/${taskId}`, data)
    return response.data.data
  },

  async deleteTask(taskId: string) {
    const response = await api.delete(`/tasks/${taskId}`)
    return response.data
  },

  async getSubtasks(taskId: string): Promise<Task[]> {
    const response = await api.get(`/tasks/${taskId}/subtasks`)
    return response.data.data
  },

  async startTimer(taskId: string) {
    const response = await api.post(`/tasks/${taskId}/start`)
    return response.data
  },

  async stopTimer(taskId: string) {
    const response = await api.post(`/tasks/${taskId}/stop`)
    return response.data
  },

  async completeTask(taskId: string) {
    const response = await api.patch(`/tasks/${taskId}/complete`)
    return response.data
  },

  async reportDelay(taskId: string, reason?: string) {
    const response = await api.post(`/tasks/${taskId}/report-delay`, { reason })
    return response.data
  },
}
