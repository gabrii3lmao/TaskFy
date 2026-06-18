import { api } from './api'

export interface Notification {
  id: string
  userId: string
  type: 'task_completed' | 'delay_report' | 'deadline_approaching' | 'task_assigned' | 'project_assigned' | 'system'
  title: string
  message: string
  taskId?: string
  projectId?: string
  read: boolean
  createdAt: string
}

export const notificationService = {
  async getNotifications(): Promise<Notification[]> {
    const response = await api.get('/notifications')
    return response.data.data
  },

  async markAsRead(id: string): Promise<Notification> {
    const response = await api.patch(`/notifications/${id}/read`)
    return response.data.data
  },

  async markAllAsRead() {
    const response = await api.patch('/notifications/read-all')
    return response.data.data
  },

  async getUnreadCount(): Promise<number> {
    const response = await api.get('/notifications/unread-count')
    return response.data.data.count
  },
}
